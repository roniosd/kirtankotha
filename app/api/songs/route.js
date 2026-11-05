import { richLyricsSchema, richTextToPlainText } from "@/lib/richLyrics";
import { z } from "zod";
import { ConnectDB } from "@/lib/DatabaseConnection";
import { currentUser, sameOrigin, readBody } from "@/lib/auth";
import Song from "@/models/Song";
import { categories, demoSongs } from "@/lib/songs";
export const runtime = "nodejs";
const schema = z.object({
  title: z.string().trim().min(2).max(120),
  category: z.enum(categories),
  type: z.enum(["কীর্তন", "গান"]),
  lyrics: z.string().trim().min(10).max(20000),
  lyricsContent: richLyricsSchema.optional(),
});
export async function GET() {
  try {
    await ConnectDB();
    const songs = await Song.find()
      .sort({ createdAt: -1 })
      .select("title category type lyrics lyricsContent author")
      .lean();
    return Response.json(
      { songs: [...songs, ...demoSongs] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error: "ডাটাবেস সংযুক্ত হয়নি। নমুনা গান দেখানো হচ্ছে।",
        songs: demoSongs,
      },
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
    const parsed = schema.safeParse(await readBody(request));
    if (!parsed.success)
      return Response.json(
        { error: "শিরোনাম, ক্যাটাগরি ও গানের কথা সঠিকভাবে পূরণ করুন।" },
        { status: 400 },
      );
    const data = {
      ...parsed.data,
      lyrics: parsed.data.lyricsContent
        ? richTextToPlainText(parsed.data.lyricsContent).trim()
        : parsed.data.lyrics,
    };
    if (data.lyrics.length < 10 || data.lyrics.length > 20000)
      return Response.json(
        { error: "গানের কথা ১০ থেকে ২০,০০০ অক্ষরের মধ্যে লিখুন।" },
        { status: 400 },
      );
    const song = await Song.create({
      ...data,
      userId: user._id,
      author: user.name || "কমিউনিটি",
    });
    return Response.json(
      { song: { _id: song._id, ...data, author: song.author } },
      { status: 201 },
    );
  } catch (e) {
    return Response.json(
      { error: "গান জমা দেওয়া যায়নি। তথ্য ও সংযোগ পরীক্ষা করুন।" },
      {
        status:
          e instanceof SyntaxError || e.message === "PAYLOAD_TOO_LARGE"
            ? 400
            : 503,
      },
    );
  }
}
