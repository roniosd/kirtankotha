import Link from "next/link";
export default function AppFooter() {
  return (
    <footer className="mt-8 space-y-2 border-t border-[#eee2d0] dark:border-stone-700 pt-5 pb-3 text-center text-xs leading-6 text-[#aa9276] dark:text-amber-100/80 dark:border-stone-800 dark:text-stone-400">
      <Link href="/terms" className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-amber-800 underline underline-offset-4 dark:text-amber-200">শেয়ার, মন্তব্য ও কপিরাইট নীতিমালা</Link>
      <p>ভক্তির গান বেঁচে থাকুক, প্রজন্ম থেকে প্রজন্মে।</p>
      <p>
        Developed by{" "}
        <span className="font-semibold text-[#936336] dark:text-amber-100/80 dark:text-amber-200">
          Roni dev
        </span>
        <span aria-hidden="true"> · </span>
        <span className="font-semibold text-[#936336] dark:text-amber-100/80 dark:text-amber-200">
          Softbin
        </span>
      </p>
    </footer>
  );
}
