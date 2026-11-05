"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Flower2, Share2, BookOpen, RefreshCw, ArrowLeft } from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
import AppHeader from "@/components/layout/AppHeader";
import LyricsContent from "./LyricsContent";
import SongActions from "./SongActions";
import AppFooter from "@/components/layout/AppFooter";
import FavoriteButton from "./FavoriteButton";
import ReadingControls from "./ReadingControls";
import SongNavigation from "./SongNavigation";
import useReadingSettings from "@/hooks/useReadingSettings";
import { filterSongs } from "@/lib/songFilters";
import { secondaryClass } from "@/components/ui/Button";
export default function SongReader({ id, initialSong = null }) {
  const params = useSearchParams(),
    from = params.get("from") || "",
    filter = new URLSearchParams(from),
    backHref = `/${from ? "?" + filter.toString() : ""}#songs`;
  const { songs, favorites, setNotice, user } = useApp(),
    settings = useReadingSettings();
  const [fetched, setFetched] = useState(initialSong),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const inList = songs.find((s) => String(s._id) === id),
    song = isDemo
      ? inList
      : inList || (String(fetched?._id) === id ? fetched : null);
  useEffect(() => {
    if (inList || initialSong || isDemo) return;
    const controller = new AbortController();
    setError("");
    fetch(`/api/songs/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setFetched(d.song);
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          setError(err.message || "গান লোড করা যায়নি।");
      });
    return () => controller.abort();
  }, [id, inList, initialSong, retry]);
  const list = filterSongs(songs, filter, favorites, user?._id),
    index = list.findIndex((s) => String(s._id) === id),
    previous = index > 0 ? list[index - 1] : null,
    next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
  async function share() {
    const url = `${window.location.origin}/songs/${encodeURIComponent(id)}`;
    try {
      if (navigator.share) await navigator.share({ title: song.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setNotice("গানের লিংক কপি হয়েছে।");
      }
    } catch (err) {
      if (err.name !== "AbortError")
        setNotice("লিংক কপি হয়নি। ব্রাউজারের ঠিকানা কপি করুন।");
    }
  }
  const { dark, fontClass } = settings;
  return (
    <div
      className={`min-h-dvh ${dark ? "bg-[#211b15] text-[#f5e7cf]" : "bg-[#fffcf5] dark:bg-stone-900 text-[#51331f] dark:text-stone-100"}`}
    >
      <AppHeader reader backHref={backHref} />
      {song ? (
        <>
          <ReadingControls {...settings} />
          <main className="mx-auto max-w-3xl px-5 pt-7 pb-52 sm:px-10 sm:pt-10">
            <div
              className={`mb-3 flex flex-wrap items-center gap-2 text-xs ${dark ? "text-amber-200/70" : "text-[#a57c48] dark:text-amber-100/80"}`}
            >
              <span
                className={`rounded-lg px-2.5 py-1 ${dark ? "bg-white/10" : "bg-[#f6ead5] dark:bg-stone-900"}`}
              >
                {song.category}
              </span>
              <span>{song.type}</span>
            </div>
            <h1 className="text-[28px] leading-[1.55] font-semibold break-words sm:text-4xl">
              {song.title}
            </h1>
            <p
              className={`mt-2 text-sm ${dark ? "text-amber-100/55" : "text-[#a58b6b] dark:text-amber-100/80"}`}
            >
              {song.author || "কমিউনিটি"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <FavoriteButton song={song} withLabel dark={dark} />
              <SongActions song={song} />
              <button
                onClick={share}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium ${dark ? "border-white/20 bg-white/5 text-amber-100" : "border-[#e6d6bd] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#936b3c] dark:text-amber-100/80"}`}
              >
                <Share2 size={19} />
                পাঠান
              </button>
            </div>
            <div
              className={`my-7 flex items-center gap-3 ${dark ? "text-amber-300/40" : "text-[#c3985e]"}`}
              aria-hidden="true"
            >
              <span
                className={`h-px flex-1 ${dark ? "bg-white/10" : "bg-[#ead8b9] dark:bg-stone-900"}`}
              />
              <Flower2 size={24} />
              <span
                className={`h-px flex-1 ${dark ? "bg-white/10" : "bg-[#ead8b9] dark:bg-stone-900"}`}
              />
            </div>
            <article
              aria-label="গানের সম্পূর্ণ কথা"
              className={`${fontClass} space-y-8 leading-[2.05] font-normal break-words selection:bg-amber-200 selection:text-stone-900`}
            >
              <LyricsContent
                lyrics={song.lyrics}
                content={song.lyricsContent}
              />
            </article>
            <div
              className={`mt-10 flex items-center justify-center gap-3 text-sm ${dark ? "text-amber-100/40" : "text-[#bb9a70] dark:text-amber-100/80"}`}
            >
              <Flower2 size={18} />
              <span>গানের কথা শেষ</span>
              <Flower2 size={18} />
            </div>
            <Link
              href={backHref}
              className={`mt-8 flex min-h-13 items-center justify-center gap-2 rounded-2xl border ${dark ? "border-white/15 text-amber-100" : "border-[#e6d5b9] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#9b6a32] dark:text-amber-100/80"}`}
            >
              <BookOpen size={19} />
              আরও গান পড়ুন
            </Link>
            <AppFooter />
          </main>
          <div className="fixed inset-x-0 bottom-0 z-30 shadow-[0_-8px_30px_#4a2b0b08]">
            <SongNavigation
              previous={previous}
              next={next}
              from={from}
              index={index}
              total={list.length}
              backHref={backHref}
              dark={dark}
            />
          </div>
        </>
      ) : (
        <main className="mx-auto max-w-xl px-5 py-16 text-center">
          {error || (isDemo && !inList) ? (
            <>
              <h1 className="mb-3 text-2xl font-semibold">
                {error || "গানটি সরানো হয়েছে।"}
              </h1>
              <button
                onClick={() => setRetry((v) => v + 1)}
                className={`${secondaryClass} mt-4`}
              >
                <RefreshCw size={18} />
                আবার চেষ্টা করুন
              </button>
            </>
          ) : (
            <p role="status" className="text-xl">
              গানের কথা খুলছে…
            </p>
          )}
          <Link
            href={backHref}
            className={`${secondaryClass} mx-auto mt-5 flex w-fit`}
          >
            <ArrowLeft size={20} />
            গানের তালিকা
          </Link>
        </main>
      )}
    </div>
  );
}
