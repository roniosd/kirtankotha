export const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#a44b24] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#873b1a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 disabled:cursor-wait disabled:opacity-50";
export const secondaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#e8d8c0] dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-base font-medium text-[#754326] dark:text-amber-100/80 transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 disabled:opacity-40";
export const inputClass =
  "min-h-13 w-full rounded-2xl border border-[#e5d6c3] dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-base text-[#492e20] dark:text-stone-100 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-3 focus:ring-amber-100";
export default function Button({ children, className = "", ...props }) {
  return (
    <button className={`${buttonClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
