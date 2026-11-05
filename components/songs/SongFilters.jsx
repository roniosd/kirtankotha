"use client";
import { useState } from "react";
import { SlidersHorizontal, Check, Search, X } from "lucide-react";
import { categories } from "@/lib/songs";
import Modal from "@/components/ui/Modal";
import { secondaryClass } from "@/components/ui/Button";
export default function SongFilters({ params, update, searchRef }) {
  const [open, setOpen] = useState(false);
  const category = params.get("category") || "",
    type = params.get("type") || "";
  return (
    <>
      <div className="flex gap-2">
        <label className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#dfc9aa] bg-white px-4 shadow-[0_2px_6px_#77421904]">
          <Search className="shrink-0 text-[#a26b32]" size={23} />
          <input
            ref={searchRef}
            value={params.get("q") || ""}
            onChange={(e) => update({ q: e.target.value })}
            type="search"
            enterKeyHint="search"
            aria-label="গানের নাম বা কথা লিখুন"
            placeholder="গানের নাম বা কথা লিখুন…"
            className="min-h-14 w-full min-w-0 bg-transparent text-base text-[#51341f] outline-none placeholder:text-[#a99a8a]"
          />
          {params.get("q") && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              aria-label="খোঁজা মুছুন"
              className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-amber-50"
            >
              <X size={18} />
            </button>
          )}
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex min-h-14 shrink-0 items-center gap-2 rounded-2xl border border-[#e0c8a5] bg-[#fff8eb] px-3 font-medium text-[#89572c] sm:px-5"
        >
          <SlidersHorizontal size={21} />
          <span>বিভাগ</span>
          {(category || type) && (
            <span className="size-2 rounded-full bg-orange-600" />
          )}
        </button>
      </div>
      <div
        className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
        aria-label="দ্রুত বিভাগ"
      >
        {["", "নামকীর্তন", "ভজন", "পদাবলী", "গৌরাঙ্গ বন্দনা"].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => update({ category: c })}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium ${category === c ? "border-[#a44b24] bg-[#a44b24] text-white" : "border-[#e9dcc8] bg-white text-[#8c7052]"}`}
          >
            {c || "সব বিভাগ"}
          </button>
        ))}
        {category &&
          !["নামকীর্তন", "ভজন", "পদাবলী", "গৌরাঙ্গ বন্দনা"].includes(
            category,
          ) && (
            <button
              onClick={() => setOpen(true)}
              className="min-h-11 shrink-0 rounded-full bg-[#a44b24] px-4 text-sm text-white"
            >
              {category}
            </button>
          )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="কোন গান পড়বেন?">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">গানের ধরন</h3>
            <div className="grid grid-cols-3 gap-2">
              {["", "কীর্তন", "গান"].map((t) => (
                <button
                  key={t}
                  aria-pressed={type === t}
                  onClick={() => update({ type: t })}
                  className={`min-h-12 rounded-xl border px-3 ${type === t ? "border-amber-700 bg-amber-100 text-amber-900" : "border-stone-200 bg-white"}`}
                >
                  {t || "সব"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">বিভাগ বেছে নিন</h3>
            <div className="grid max-h-[44dvh] grid-cols-2 gap-2 overflow-y-auto pr-1">
              {["", ...categories].map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => update({ category: c })}
                  className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-base ${category === c ? "border-amber-700 bg-amber-100 text-amber-950" : "border-[#eadfcf] bg-white text-[#7f654b]"}`}
                >
                  {c || "সব বিভাগ"}
                  {category === c && <Check size={17} className="shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 grid grid-cols-2 gap-3 bg-[#fffdf8] pt-2">
            <button
              className={secondaryClass}
              onClick={() => update({ category: "", type: "" })}
            >
              সব বিভাগ
            </button>
            <button
              onClick={() => setOpen(false)}
              className="min-h-13 rounded-2xl bg-[#a44b24] px-4 font-semibold text-white"
            >
              গান দেখুন
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
