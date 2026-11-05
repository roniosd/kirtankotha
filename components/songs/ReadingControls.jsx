"use client";
import { Minus, Plus, Moon, Sun } from "lucide-react";
import { isDemo } from "@/components/AppProvider";
import { bn } from "@/lib/songFilters";
import { readingSizes } from "@/hooks/useReadingSettings";
export default function ReadingControls({ size, setSize, dark, setDark }) {
  const outline = dark
    ? "border-white/15 bg-[#30271e] text-amber-100"
    : "border-[#ead9be] bg-white text-[#875a2e]";
  return (
    <section
      aria-label="পড়ার সুবিধা"
      className={`sticky z-20 border-b px-4 py-3 sm:px-8 ${isDemo ? "top-[98px] sm:top-[106px]" : "top-18 sm:top-20"} ${dark ? "border-white/10 bg-[#211b15]/98" : "border-[#eadcc6] bg-[#fffaf0]/98"} backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div>
          <p
            className={`text-sm font-medium ${dark ? "text-amber-200" : "text-[#8e643a]"}`}
          >
            লেখার আকার
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <button
              disabled={size === 0}
              onClick={() => setSize((v) => Math.max(0, v - 1))}
              aria-label="লেখা ছোট করুন"
              className={`flex min-h-11 items-center justify-center gap-1 rounded-xl border px-2 text-[13px] disabled:opacity-30 ${outline}`}
            >
              <Minus size={18} />
              ছোট
            </button>
            <span
              className={`min-w-7 text-center text-sm ${dark ? "text-amber-100/70" : "text-[#aa8e6e]"}`}
              aria-live="polite"
            >
              {bn(20 + size * 4)}
            </span>
            <button
              disabled={size === readingSizes.length - 1}
              onClick={() =>
                setSize((v) => Math.min(readingSizes.length - 1, v + 1))
              }
              aria-label="লেখা বড় করুন"
              className={`flex min-h-11 items-center justify-center gap-1 rounded-xl border px-2 text-[13px] disabled:opacity-30 ${outline}`}
            >
              <Plus size={18} />
              বড়
            </button>
          </div>
        </div>
        <button
          onClick={() => setDark((v) => !v)}
          aria-pressed={dark}
          className={`flex min-h-13 items-center gap-1.5 rounded-2xl border px-2 text-[13px] font-medium ${outline}`}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
          <span>{dark ? "দিনের আলো" : "রাতের আলো"}</span>
        </button>
      </div>
    </section>
  );
}
