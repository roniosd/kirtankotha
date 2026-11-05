"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Heart,
  Flower2,
  ArrowRight,
  Plus,
  RefreshCw,
  Search,
  LogIn,
} from "lucide-react";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import SongList from "@/components/songs/SongList";
import SongFilters from "@/components/songs/SongFilters";
import { useApp } from "@/components/AppProvider";
import { bn, filterSongs } from "@/lib/songFilters";
import Button, { secondaryClass } from "@/components/ui/Button";
export default function Home() {
  const params = useSearchParams(),
    searchRef = useRef(null);
  const {
    songs,
    loading,
    loadError,
    refreshSongs,
    user,
    authLoading,
    favorites,
    favoritesReady,
    favoritesError,
    refreshFavorites,
    setModal,
    openUpload,
  } = useApp();
  const favoritesView = params.get("view") === "favorites",
    mineView = params.get("view") === "mine";
  function update(values) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    window.history.replaceState(
      null,
      "",
      `/${next.size ? "?" + next.toString() : ""}#songs`,
    );
  }
  useEffect(() => {
    if (params.get("focus") === "search") searchRef.current?.focus();
  }, [params]);
  const displayError = (favoritesView && favoritesError) || loadError;
  const filtered = filterSongs(songs, params, favorites, user?._id),
    needsLogin = (favoritesView || mineView) && !user;
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-8 sm:pt-8 sm:pb-10">
        {!favoritesView && !mineView && (
          <section
            aria-label="স্বাগতম"
            className="relative isolate mb-7 overflow-hidden rounded-3xl border border-[#ead8b8] dark:border-stone-700 bg-[#f8ead1] dark:bg-stone-900 px-5 py-6 sm:mb-9 sm:px-10 sm:py-12"
          >
            <img
              src="/images/devotional-temple.webp"
              alt="পদ্ম ও প্রদীপসহ বাংলার মন্দির"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] sm:object-right"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#fff1d9] via-[#fff1d9]/95 to-[#fff1d9]/15 sm:via-[#fff1d9]/75 dark:from-stone-950 dark:via-stone-950/85 dark:to-stone-950/35" />
            <p className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-[#a16e37] dark:text-amber-100/80">
              <Flower2 size={16} />
              সনাতন ভক্তিগীতির উন্মুক্ত খাতা
            </p>
            <h1 className="max-w-lg text-[32px] leading-[1.35] font-semibold tracking-tight text-[#58321e] dark:text-stone-100 sm:text-5xl">
              ভক্তির সুরে,
              <br />
              <span className="text-[#a64b24] dark:text-amber-100/80">
                শান্তি খুঁজে নিন।
              </span>
            </h1>
            <p className="mt-3 hidden max-w-65 text-sm leading-7 text-[#896949] dark:text-amber-100/80 sm:block sm:max-w-md sm:text-base">
              প্রিয় গান খুঁজুন। নামের ওপর চাপ দিয়ে
              <br className="sm:hidden" /> সহজে গানের কথা পড়ুন।
            </p>
            <a
              href="#songs"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#a44b24] px-4 text-sm font-medium text-white sm:min-h-12 sm:px-5"
            >
              <BookOpen size={18} />
              গান পড়ুন
              <ArrowRight size={17} />
            </a>
          </section>
        )}
        <section id="songs" className="scroll-mt-30">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs tracking-wide text-[#a47f53] dark:text-amber-100/80">
                {favoritesView || mineView
                  ? "আপনার শেয়ার করা গানের খাতা"
                  : "ভক্তির কথামালা"}
              </p>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-[#52311c] dark:text-stone-100 sm:text-3xl">
                {mineView ? (
                  "আমার গান"
                ) : favoritesView ? (
                  <>
                    <Heart
                      size={25}
                      className="text-[#b05b37] dark:text-amber-100/80"
                    />
                    প্রিয় গান
                  </>
                ) : (
                  "গানের সংগ্রহ"
                )}
              </h1>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => update({ view: "" })}
                aria-pressed={!favoritesView}
                className={`${secondaryClass} ${!favoritesView ? "border-amber-700 bg-amber-50 dark:bg-amber-950/40" : ""}`}
              >
                <BookOpen size={18} />
                সব গান
              </button>
              <button
                onClick={() => update({ view: "favorites" })}
                aria-pressed={favoritesView}
                className={`${secondaryClass} ${favoritesView ? "border-amber-700 bg-amber-50 dark:bg-amber-950/40" : ""}`}
              >
                <Heart size={18} />
                প্রিয় গান
              </button>
            </div>
            <span className="text-sm text-[#a1815b] dark:text-amber-100/80 sm:hidden">
              চাপ দিন, পড়ুন
            </span>
          </div>
          <SongFilters params={params} update={update} searchRef={searchRef} />
          {needsLogin && !authLoading ? (
            <div className="my-6 rounded-3xl border border-[#e8d4b5] dark:border-stone-700 bg-[#fff6e7] dark:bg-stone-900 p-7 text-center">
              <Heart
                size={34}
                className="mx-auto mb-3 text-[#b15d3b] dark:text-amber-100/80"
              />
              <h2 className="text-xl font-semibold">
                আপনার গানের খাতা খুলতে লগইন করুন
              </h2>
              <p className="mx-auto mt-2 max-w-sm leading-7 text-[#987555] dark:text-amber-100/80">
                যে গান ভালো লাগে, হৃদয় চিহ্নে চাপ দিন। পরে এখানে সব গান একসঙ্গে
                পাবেন।
              </p>
              <Button onClick={() => setModal("account")} className="mt-5">
                <LogIn size={19} />
                লগইন করুন
              </Button>
            </div>
          ) : loading ||
            (favoritesView &&
              !favoritesError &&
              (!favoritesReady || authLoading)) ? (
            <div role="status" className="space-y-3 py-5">
              <p className="text-sm text-[#987555] dark:text-amber-100/80">
                গান লোড হচ্ছে…
              </p>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-26 animate-pulse rounded-2xl bg-[#efe6d7] dark:bg-stone-900"
                />
              ))}
            </div>
          ) : displayError ? (
            <div
              role="alert"
              className="my-6 rounded-3xl border border-red-100 bg-red-50 dark:bg-red-950/40 p-6"
            >
              <p className="leading-7 text-red-900 dark:text-red-300">
                {displayError}
              </p>
              <button
                onClick={
                  favoritesView && favoritesError
                    ? refreshFavorites
                    : refreshSongs
                }
                className={`${secondaryClass} mt-4`}
              >
                <RefreshCw size={18} />
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 py-4 text-sm text-[#9a7e5c] dark:text-amber-100/80">
                <p>
                  {bn(filtered.length)}টি গান
                  {params.get("q") ? " পাওয়া গেছে" : ""}
                </p>
                {(params.get("q") ||
                  params.get("category") ||
                  params.get("type")) && (
                  <button
                    onClick={() => update({ q: "", category: "", type: "" })}
                    className="min-h-10 rounded-xl px-2 text-[#a44b24] dark:text-amber-100/80 underline underline-offset-4"
                  >
                    সব দেখুন
                  </button>
                )}
              </div>
              {filtered.length ? (
                <SongList songs={filtered} from={params.toString()} />
              ) : (
                <div className="rounded-3xl border border-dashed border-[#ddc5a0] dark:border-stone-700 bg-[#fff9ef] dark:bg-stone-900 px-5 py-10 text-center">
                  {favoritesView ? (
                    <Heart
                      size={34}
                      className="mx-auto mb-4 text-[#bb8a55] dark:text-amber-100/80"
                    />
                  ) : (
                    <Search
                      size={34}
                      className="mx-auto mb-4 text-[#bb8a55] dark:text-amber-100/80"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-[#694526] dark:text-stone-100">
                    {favoritesView
                      ? "এখানে এখনও কোনো গান নেই"
                      : "কোনো গান পাওয়া যায়নি"}
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-base leading-7 text-[#9b7c5b] dark:text-amber-100/80">
                    {favoritesView
                      ? "গানের পাশে হৃদয় চিহ্নে চাপ দিন। সেই গান এখানে পাবেন।"
                      : "অন্য নাম দিয়ে খুঁজুন অথবা সব বিভাগ দেখুন।"}
                  </p>
                  <button
                    onClick={() =>
                      update({ q: "", category: "", type: "", view: "" })
                    }
                    className={`${secondaryClass} mt-5`}
                  >
                    <BookOpen size={18} />
                    সব গান দেখুন
                  </button>
                </div>
              )}
            </>
          )}
          <aside className="mt-7 flex flex-wrap items-center gap-4 rounded-3xl border border-[#ebd7b5] dark:border-stone-700 bg-[#fbefda] dark:bg-stone-900 p-5 sm:p-6">
            <span className="hidden size-12 items-center justify-center rounded-2xl border border-[#e6cda3] dark:border-stone-700 text-[#b27a39] dark:text-amber-100/80 sm:flex">
              <Flower2 size={26} />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#684125] dark:text-stone-100">
                আপনার জানা গানটি যোগ করুন
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#987958] dark:text-amber-100/80">
                সবার গানের খাতা আরও সমৃদ্ধ হোক।
              </p>
            </div>
            <button
              onClick={openUpload}
              className={`${secondaryClass} w-full sm:w-auto`}
            >
              <Plus size={21} />
              নতুন গান দিন
            </button>
          </aside>
        </section>
        <AppFooter />
      </main>
      <BottomNav />
    </>
  );
}
