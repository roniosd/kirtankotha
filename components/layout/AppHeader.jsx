"use client";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import {
  Flower2,
  UserRound,
  ArrowLeft,
  Plus,
  ExternalLink,
  ScanText,
} from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
export default function AppHeader({ reader = false, backHref = "/" }) {
  const { setModal, user, openUpload } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-[#ecdfcb] dark:border-stone-700 bg-[#fffdf8]/95 dark:bg-stone-900 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-3 px-4 sm:h-20 sm:px-8">
        {reader ? (
          <Link
            href={backHref}
            aria-label="গানের তালিকায় ফিরুন"
            className="flex min-h-12 items-center gap-2 rounded-xl px-2 font-medium text-amber-900 dark:text-amber-100"
          >
            <ArrowLeft size={23} />
            <span className="text-base">তালিকা</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="কীর্তনকথা হোম"
          >
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-2xl bg-[#a44b24] text-2xl text-amber-50"
            >
              ওঁ
            </span>
            <span>
              <span className="block text-2xl leading-7 font-semibold tracking-tight text-[#53301c] dark:text-stone-100">
                কীর্তন
                <span className="text-[#b66b32] dark:text-amber-100/80">
                  কথা
                </span>
              </span>
              <span className="block text-[11px] text-[#987858] dark:text-amber-100/80">
                ভক্তির গান, সবার জন্য
              </span>
            </span>
          </Link>
        )}
        {reader && (
          <span className="ml-auto hidden items-center gap-2 text-sm text-[#9a7858] dark:text-amber-100/80 sm:flex">
            <Flower2 size={17} />
            গানের কথা
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={openUpload}
            className="hidden min-h-12 items-center gap-2 rounded-2xl bg-[#a44b24] px-4 text-white sm:flex"
          >
            <Plus size={19} />
            গান যোগ করুন
          </button>
          <button
            onClick={() => setModal("account")}
            aria-label={user ? "আমার অ্যাকাউন্ট" : "লগইন করুন"}
            className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#eadac3] dark:border-stone-700 bg-white dark:bg-stone-900 px-3 text-sm font-medium text-[#744322] dark:text-amber-100/80"
          >
            <UserRound size={21} />
            <span>{user ? "অ্যাকাউন্ট" : "লগইন"}</span>
          </button>
        </div>

        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          <ScanText size={22} aria-hidden="true" /> Google Lens খুলুন{" "}
          <ExternalLink size={18} aria-hidden="true" />
          <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
        </a>
      </div>
    </header>
  );
}
