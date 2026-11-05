import { ConnectDB } from "@/lib/DatabaseConnection";
import { currentUser, sameOrigin, readBody } from "@/lib/auth";
import { canManageSong } from "@/lib/permissions";
import { songSchema } from "@/lib/songSchema";
import Song from "@/models/Song";
export const runtime = "nodejs";
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const valid = (id) => /^[a-f\d]{24}$/i.test(id);
export async function GET(request, { params }) {
  const { id } = await params;
  if (!valid(id)) return json({ error: "গানটি পাওয়া যায়নি।" }, 404);
  try {
    await ConnectDB();
    const song = await Song.findOne({ _id: id, deletedAt: null })
      .select(
        "title category type lyrics lyricsContent author userId createdAt updatedAt",
      )
      .lean();
    return song ? json({ song }) : json({ error: "গানটি পাওয়া যায়নি।" }, 404);
  } catch {
    return json({ error: "গান লোড করা যায়নি। আবার চেষ্টা করুন।" }, 503);
  }
}
async function authorize(request, params) {
  if (!sameOrigin(request))
    return { error: json({ error: "অনুমতি নেই।" }, 403) };
  const { id } = await params;
  if (!valid(id)) return { error: json({ error: "গানটি পাওয়া যায়নি।" }, 404) };
  const user = await currentUser();
  if (!user) return { error: json({ error: "প্রথমে লগইন করুন।" }, 401) };
  const song = await Song.findOne({ _id: id, deletedAt: null }).lean();
  if (!song) return { error: json({ error: "গানটি পাওয়া যায়নি।" }, 404) };
  if (!canManageSong(user, song))
    return { error: json({ error: "শুধু নিজের গান পরিবর্তন করা যাবে।" }, 403) };
  return { user, song, id };
}
export async function PATCH(request, { params }) {
  try {
    const auth = await authorize(request, params);
    if (auth.error) return auth.error;
    const parsed = songSchema.safeParse(await readBody(request));
    if (!parsed.success)
      return json({ error: "নাম, বিভাগ ও গানের কথা সঠিকভাবে দিন।" }, 400);
    const song = await Song.findOneAndUpdate(
      { _id: auth.id, deletedAt: null },
      {
        $set: {
          ...parsed.data,
          lyricsContent: parsed.data.lyricsContent || null,
        },
      },
      { new: true, runValidators: true },
    );
    return song ? json({ song }) : json({ error: "গানটি পাওয়া যায়নি।" }, 404);
  } catch (error) {
    return json(
      { error: "পরিবর্তন সংরক্ষিত হয়নি।" },
      error instanceof SyntaxError || error.message === "PAYLOAD_TOO_LARGE"
        ? 400
        : 503,
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const auth = await authorize(request, params);
    if (auth.error) return auth.error;
    const song = await Song.findOneAndUpdate(
      { _id: auth.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );
    return song
      ? json({ success: true })
      : json({ error: "গানটি পাওয়া যায়নি।" }, 404);
  } catch {
    return json({ error: "গান মুছতে পারিনি। আবার চেষ্টা করুন।" }, 503);
  }
}
