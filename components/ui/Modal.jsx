"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-lg lg:max-w-1/2 overflow-y-auto rounded-3xl border border-amber-100 dark:border-stone-700 bg-[#fffdf8] dark:bg-stone-900 p-5 text-[#492e20] dark:text-stone-100 shadow-2xl backdrop:bg-stone-950/55 backdrop:backdrop-blur-sm sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 hover:bg-amber-100"
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
