"use client";
import { Moon, Sun } from "lucide-react";
import useSiteTheme from "@/hooks/useSiteTheme";
export default function ThemeToggle() {
  const { dark, setDark } = useSiteTheme();
  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      aria-label={
        dark ? "দিনের আলো চালু করুন" : "পুরো সাইটে রাতের আলো চালু করুন"
      }
      title={dark ? "দিনের আলো" : "রাতের আলো"}
      className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-[#eadac3] dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm font-medium text-[#87552c] dark:text-amber-100/80 dark:border-stone-700 dark:bg-stone-800 dark:text-amber-100"
    >
      {dark ? <Sun size={21} /> : <Moon size={21} />}
      <span className="hidden sm:inline">{dark ? "দিন" : "রাত"}</span>
    </button>
  );
}
