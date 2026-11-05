import { z } from "zod";
import { currentUser, sameOrigin, readBody } from "@/lib/auth";
import User from "@/models/User";
import Song from "@/models/Song";
import { demoSongs } from "@/lib/songs";
export const runtime = "nodejs";
const schema = z.object({
  songId: z.string().regex(/^(?:[a-f\d]{24}|[1-6])$/i),
  favorite: z.boolean(),
});
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return json({ error: "প্রথমে লগইন করুন।" }, 401);
    const record = await User.findById(user._id).select("+favorites").lean();
    return json({ favorites: record?.favorites || [] });
  } catch {
    return json({ error: "প্রিয় গানের তালিকা লোড করা যায়নি।" }, 503);
  }
}
export async function PUT(request) {
  if (!sameOrigin(request)) return json({ error: "অনুমতি নেই।" }, 403);
  try {
    const user = await currentUser();
    if (!user) return json({ error: "প্রথমে লগইন করুন।" }, 401);
    const parsed = schema.safeParse(await readBody(request));
    if (!parsed.success) return json({ error: "সঠিক গান নির্বাচন করুন।" }, 400);
    const { songId, favorite } = parsed.data;
    if (
      favorite &&
      !demoSongs.some((song) => song._id === songId) &&
      !(await Song.exists({ _id: songId, deletedAt: null }))
    )
      return json({ error: "গানটি পাওয়া যায়নি।" }, 404);
    const userRecord = await User.findByIdAndUpdate(
      user._id,
      favorite
        ? { $addToSet: { favorites: songId } }
        : { $pull: { favorites: songId } },
      { new: true },
    )
      .select("+favorites")
      .lean();
    return json({ favorites: userRecord?.favorites || [] });
  } catch (error) {
    return json(
      { error: "প্রিয় গানের তালিকা আপডেট করা যায়নি।" },
      error instanceof SyntaxError || error.message === "PAYLOAD_TOO_LARGE"
        ? 400
        : 503,
    );
  }
}
