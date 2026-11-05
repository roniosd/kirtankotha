"use client";
import Link from "next/link";
import { Flower2, UserRound, ArrowLeft, Plus } from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
export default function AppHeader({ reader = false, backHref = "/" }) {
  const { setModal, user, openUpload } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-[#ecdfcb] bg-[#fffdf8]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-3 px-4 sm:h-20 sm:px-8">
        {reader ? (
          <Link
            href={backHref}
            aria-label="গানের তালিকায় ফিরুন"
            className="flex min-h-12 items-center gap-2 rounded-xl px-2 font-medium text-amber-900"
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
              <span className="block text-2xl leading-7 font-semibold tracking-tight text-[#53301c]">
                কীর্তন<span className="text-[#b66b32]">কথা</span>
              </span>
              <span className="block text-[11px] text-[#987858]">
                ভক্তির গান, সবার জন্য
              </span>
            </span>
          </Link>
        )}
        {reader && (
          <span className="ml-auto hidden items-center gap-2 text-sm text-[#9a7858] sm:flex">
            <Flower2 size={17} />
            গানের কথা
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
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
            className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#eadac3] bg-white px-3 text-sm font-medium text-[#744322]"
          >
            <UserRound size={21} />
            <span>{user ? "অ্যাকাউন্ট" : "লগইন"}</span>
          </button>
        </div>
      </div>
      {isDemo && (
        <p className="border-t border-amber-100 bg-amber-50 px-4 py-1 text-center text-[11px] text-amber-900">
          নমুনা প্রিভিউ · প্রিয় গান এই ব্রাউজারে থাকে
        </p>
      )}
    </header>
  );
}
