"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ListMusic } from "lucide-react";
import { songHref, bn } from "@/lib/songFilters";
export default function SongNavigation({
  previous,
  next,
  from,
  index,
  total,
  backHref,
  dark,
}) {
  const common =
    "flex min-h-12 sm:min-h-16 flex-1 items-center justify-center gap-2 rounded-2xl border px-3 text-sm sm:text-base font-semibold transition";
  const active = dark
    ? "border-[#aa7444] bg-[#50351f] text-amber-50 hover:bg-[#694827]"
    : "border-[#dcb786] dark:border-stone-700 bg-[#fbecd4] dark:bg-stone-900 text-[#925424] dark:text-amber-100/80 hover:bg-[#f3dfbd]";
  const disabled = dark
    ? "border-white/10 text-white/25"
    : "border-[#eee2d2] dark:border-stone-700 bg-[#f7f3ec] dark:bg-stone-900 text-[#bdac96] dark:text-amber-100/80";
  return (
    <nav
      aria-label="আগের ও পরের গান"
      className={`border-t px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] sm:px-8 ${dark ? "border-white/10 bg-[#211b15]" : "border-[#e8d8c0] dark:border-stone-700 bg-[#fffdf8] dark:bg-stone-900"}`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 hidden sm:flex items-center justify-between gap-3 text-xs">
          <Link
            href={backHref}
            className={`flex min-h-9 items-center gap-1.5 underline underline-offset-4 ${dark ? "text-amber-200" : "text-[#a77a46] dark:text-amber-100/80"}`}
          >
            <ListMusic size={16} />
            তালিকায় ফিরুন
          </Link>
          <span
            className={
              dark
                ? "text-amber-100/60"
                : "text-[#a78e70] dark:text-amber-100/80"
            }
          >
            {index >= 0
              ? `${bn(total)}টি গানের মধ্যে ${bn(index + 1)}`
              : "গানের কথা"}
          </span>
        </div>
        <div className="flex gap-3">
          {previous ? (
            <Link
              href={songHref(previous._id, from)}
              className={`${common} ${active}`}
              aria-label={`আগের গান: ${previous.title}`}
            >
              <ArrowLeft size={21} />
              <span>আগের গান</span>
            </Link>
          ) : (
            <button disabled className={`${common} ${disabled}`}>
              <ArrowLeft size={21} />
              আগের গান
            </button>
          )}
          {next ? (
            <Link
              href={songHref(next._id, from)}
              className={`${common} ${active}`}
              aria-label={`পরের গান: ${next.title}`}
            >
              <span>পরের গান</span>
              <ArrowRight size={21} />
            </Link>
          ) : (
            <button disabled className={`${common} ${disabled}`}>
              পরের গান
              <ArrowRight size={21} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
