import { Suspense } from "react";
import { notFound } from "next/navigation";
import { demoSongs } from "@/lib/songs";
import SongReader from "@/components/songs/SongReader";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const { id } = await params;
  const song = demoSongs.find((s) => s._id === id);
  return {
    title: song ? `${song.title} — কীর্তনকথা` : "গানের কথা — কীর্তনকথা",
    alternates: { canonical: `/songs/${id}` },
  };
}
export default async function Page({ params }) {
  const { id } = await params;
  if (!/^(?:[a-f\d]{24}|[1-6])$/i.test(id)) notFound();
  const sample = demoSongs.find((s) => s._id === id) || null;
  return (
    <Suspense
      fallback={
        <p className="p-10 text-center text-amber-900">গানের কথা খুলছে…</p>
      }
    >
      <SongReader key={id} id={id} initialSong={sample} />
    </Suspense>
  );
}
