import { ConnectDB } from "@/lib/DatabaseConnection";
import { currentUser, sameOrigin, readBody } from "@/lib/auth";
import Song from "@/models/Song";
import { songSchema } from "@/lib/songSchema";
export const runtime = "nodejs";
export async function GET() {
  try {
    await ConnectDB();
    const songs = await Song.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .select(
        "title category type lyrics lyricsContent author lyricist collectedBy source contributionType userId createdAt updatedAt",
      )
      .lean();
    return Response.json(
      { songs },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Song list failed:", error.name, error.message);
    return Response.json(
      { error: "গান লোড করা যায়নি। আবার চেষ্টা করুন।", songs: [] },
      { status: 503 },
    );
  }
}
export async function POST(request) {
  if (!sameOrigin(request))
    return Response.json({ error: "অনুমতি নেই।" }, { status: 403 });
  try {
    const user = await currentUser();
    if (!user)
      return Response.json({ error: "প্রথমে লগইন করুন।" }, { status: 401 });
    const parsed = songSchema.safeParse(await readBody(request));
    if (!parsed.success)
      return Response.json(
        { error: "নাম, বিভাগ ও গানের কথা সঠিকভাবে দিন।" },
        { status: 400 },
      );
    const song = await Song.create({
      ...parsed.data,
      userId: user._id,
      collectedBy: user.name || "কমিউনিটির সদস্য",
    });
    return Response.json({ song }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "গান জমা দেওয়া যায়নি।" },
      {
        status:
          error instanceof SyntaxError || error.message === "PAYLOAD_TOO_LARGE"
            ? 400
            : 503,
      },
    );
  }
}
