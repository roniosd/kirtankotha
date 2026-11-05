"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
export default function SongActions({ song, compact = false }) {
  const { canManage, openEdit, requestDelete } = useApp();
  if (!canManage(song)) return null;
  const style =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium";
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => openEdit(song)}
        aria-label={`${song.title} সম্পাদনা করুন`}
        className={`${style} bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100`}
      >
        <Pencil size={17} />
        {compact ? "বদলান" : "সম্পাদনা"}
      </button>
      <button
        type="button"
        onClick={() => requestDelete(song)}
        aria-label={`${song.title} মুছুন`}
        className={`${style} bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300`}
      >
        <Trash2 size={17} />
        মুছুন
      </button>
    </div>
  );
}
