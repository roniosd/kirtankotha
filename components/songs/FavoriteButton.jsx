"use client";
import { Heart } from "lucide-react";
import { useApp } from "@/components/AppProvider";
export default function FavoriteButton({
  song,
  withLabel = false,
  dark = false,
}) {
  const {
    favorites,
    toggleFavorite,
    favoriteBusy,
    favoritesReady,
    user,
    authLoading,
  } = useApp();
  const saved = favorites.includes(String(song._id));
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(String(song._id))}
      disabled={
        authLoading || favoriteBusy || (!!user && !favoritesReady)
      }
      aria-label={`${song.title} ${saved ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় গানে রাখুন"}`}
      aria-pressed={saved}
      className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-medium transition disabled:opacity-40 ${saved ? "border-[#e7b59a] dark:border-stone-700 bg-[#fff0e5] dark:bg-stone-900 text-[#ac472d] dark:text-amber-100/80" : dark ? "border-white/20 bg-white/5 text-amber-100" : "border-[#eddfcb] dark:border-stone-700 bg-[#fffcf6] dark:bg-stone-900 text-[#957452] dark:text-amber-100/80"} ${withLabel ? "px-4" : "min-w-12"}`}
    >
      <Heart size={21} fill={saved ? "currentColor" : "none"} />
      {withLabel && (saved ? "প্রিয় গানে আছে" : "প্রিয় গানে রাখুন")}
    </button>
  );
}
