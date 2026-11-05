import { Suspense } from "react";
import { notFound } from "next/navigation";
import SongReader from "@/components/songs/SongReader";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: "গানের কথা — কীর্তনকথা", alternates: { canonical: `/songs/${id}` } };
}
export default async function Page({ params }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  return <Suspense fallback={<p className="p-10 text-center">গানের কথা খুলছে…</p>}><SongReader key={id} id={id} /></Suspense>;
}
