"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, ScanText, UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useApp } from "@/components/AppProvider";
export default function AppHeader({ reader = false, backHref = "/" }) {
  const headerRef = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--app-header-height", `${entry.target.getBoundingClientRect().height}px`);
    });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);
  const { setModal, user, openUpload } = useApp();
  return <header ref={headerRef} className="sticky top-0 z-30 border-b border-amber-900/10 bg-[#fffdf8]/95 backdrop-blur-xl dark:border-stone-700 dark:bg-stone-900/95">
    <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 px-3 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-4">
      {reader ? <Link href={backHref} className="flex min-h-11 w-fit items-center gap-2 rounded-xl px-2 font-medium text-amber-900 dark:text-amber-100"><ArrowLeft size={22} aria-hidden="true" />গানের তালিকা</Link> : <Link href="/" aria-label="কীর্তনকথা হোম" className="flex min-w-0 items-center gap-2"><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-600 to-[#a44b24] text-2xl text-amber-50 sm:size-12">ওঁ</span><span className="min-w-0"><span className="block whitespace-nowrap text-xl font-semibold text-[#53301c] dark:text-stone-100 sm:text-2xl">কীর্তন<span className="text-[#b66b32] dark:text-amber-200">কথা</span></span><span className="hidden text-xs text-stone-500 min-[360px]:block dark:text-stone-400">ভক্তির গান, সবার জন্য</span></span></Link>}
      <div className="flex shrink-0 items-center gap-1.5 lg:col-start-3 lg:row-start-1"><ThemeToggle /><button type="button" onClick={() => setModal("account")} aria-label={user ? "আমার অ্যাকাউন্ট" : "লগইন করুন"} className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-amber-900/15 px-2.5 text-sm font-medium text-[#744322] hover:bg-amber-50 dark:border-stone-700 dark:text-amber-100 dark:hover:bg-stone-800"><UserRound size={20} aria-hidden="true" /><span>{user ? "অ্যাকাউন্ট" : "লগইন"}</span></button></div>
      <nav aria-label="গান যোগ ও ছবি স্ক্যান" className="col-span-2 grid grid-cols-2 gap-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
        <button type="button" onClick={openUpload} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a44b24] px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-white hover:bg-[#873c1c]"><Plus size={20} aria-hidden="true" />গান যোগ করুন</button>
        <a href="https://lens.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Google Lens খুলুন — নতুন ট্যাবে" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-sky-900 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100"><ScanText size={20} aria-hidden="true" />Google Lens</a>
      </nav>
    </div>

  </header>;
}
