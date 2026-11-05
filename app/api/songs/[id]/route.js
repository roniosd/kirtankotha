import { ConnectDB } from "@/lib/DatabaseConnection";
import Song from "@/models/Song";
import { demoSongs } from "@/lib/songs";
export const runtime = "nodejs";
export async function GET(request, { params }) {
  const { id } = await params;
  const sample = demoSongs.find((song) => song._id === id);
  if (sample) return Response.json({ song: sample });
  if (!/^[a-f\d]{24}$/i.test(id))
    return Response.json({ error: "গানটি পাওয়া যায়নি।" }, { status: 404 });
  try {
    await ConnectDB();
    const song = await Song.findById(id)
      .select("title category type lyrics lyricsContent author")
      .lean();
    if (!song)
      return Response.json({ error: "গানটি পাওয়া যায়নি।" }, { status: 404 });
    return Response.json(
      { song },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Single song failed:", error.name, error.message);
    return Response.json(
      { error: "গান লোড করা যায়নি। আবার চেষ্টা করুন।" },
      { status: 503 },
    );
  }
}
