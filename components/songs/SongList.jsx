"use client";
import Link from "next/link";
import { ChevronRight, Music2 } from "lucide-react";
import { bn, songHref } from "@/lib/songFilters";
import FavoriteButton from "./FavoriteButton";
export default function SongList({ songs, from }) {
  return (
    <ol className="space-y-3" aria-label="গানের তালিকা">
      {songs.map((song, index) => (
        <li
          key={song._id}
          className="group flex items-center gap-2 rounded-2xl border border-[#ecdfcc] bg-white p-2.5 shadow-[0_2px_8px_#77421904] transition hover:border-[#cf9e68] hover:shadow-sm sm:gap-4 sm:rounded-3xl sm:p-4"
        >
          <Link
            href={songHref(song._id, from)}
            className="flex min-h-19 min-w-0 flex-1 items-center gap-3 rounded-xl p-1.5 focus-visible:outline-2 focus-visible:outline-amber-700 sm:gap-5"
          >
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#fbf0de] text-base font-medium text-[#a6773f] sm:size-14 sm:text-xl"
            >
              {bn(index + 1)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                <span className="rounded-md bg-[#fcf0dd] px-2 py-0.5 text-[#9f6c30]">
                  {song.category}
                </span>
                <span className="text-[#a08d79]">{song.type}</span>
              </div>
              <h3 className="text-lg leading-7 font-semibold break-words text-[#52331f] sm:text-[22px]">
                {song.title}
              </h3>
              <p className="mt-1 hidden truncate text-sm text-stone-500 sm:block">
                {song.lyrics.split("\n")[0]}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[#aa7945]">
              <span className="hidden text-sm sm:inline">পড়ুন</span>
              <ChevronRight size={21} />
            </span>
          </Link>
          <FavoriteButton song={song} />
        </li>
      ))}
    </ol>
  );
}
