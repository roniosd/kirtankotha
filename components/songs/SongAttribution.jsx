"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, PenLine, UserRound } from "lucide-react";
import Modal from "@/components/ui/Modal";
const storageKey = "kirtan-sharing-notice-v1";
export default function SongAttribution({ song }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(storageKey)) setOpen(true); }
    catch { setOpen(true); }
  }, []);
  function close() {
    try { localStorage.setItem(storageKey, "read"); } catch {}
    setOpen(false);
  }
  return <>
    <div className="mt-4 grid gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 dark:border-stone-700 dark:bg-stone-800">
      <p className="flex items-start gap-2"><PenLine size={18} className="mt-1 shrink-0 text-violet-600 dark:text-violet-300" /><span>গীতিকার: <strong>{song.lyricist || "নাম জানা নেই"}</strong></span></p>
      <p className="flex items-start gap-2"><UserRound size={18} className="mt-1 shrink-0 text-teal-700 dark:text-teal-300" /><span>শেয়ার করেছেন: {song.collectedBy || song.author || "কমিউনিটির সদস্য"}</span></p>
      <p className="text-stone-600 dark:text-stone-300">{song.contributionType === "original" ? "জমাদাতা নিজের লেখা হিসেবে উল্লেখ করেছেন; তথ্যটি স্বাধীনভাবে যাচাই করা হয়নি।" : "সংগৃহীত গান · জমাদাতা গীতিকার নাও হতে পারেন।"}</p>
      {song.source && <p className="break-words">সংগ্রহের উৎস: {song.source}</p>}
      <button type="button" onClick={() => setOpen(true)} className="flex min-h-11 w-fit items-center gap-2 font-semibold text-amber-900 underline underline-offset-4 dark:text-amber-200"><Info size={18} />গীতিকার ও শেয়ার সম্পর্কে জানুন</button>
    </div>
    <Modal open={open} onClose={close} title="একটি কথা জেনে নিন">
      <div className="space-y-4 text-base leading-8">
        <p>এখানে অনেকে বই, ডায়েরি বা অন্য অনুমোদিত উৎস থেকে গান সংগ্রহ করে শেয়ার করেন। আপলোড করেছেন মানেই তিনি গানটির গীতিকার বা স্বত্বাধিকারী নন।</p>
        <p>নিজের লেখা গানও যোগ করা যায়। জানা থাকলে গীতিকারের নাম দিন। নাম বা বানানে ভুল দেখলে নিচে মন্তব্য করে সঠিক তথ্য ও উৎস জানান।</p>
        <p className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40">শুধু শেয়ার করার উদ্দেশ্য বা নাম উল্লেখ করা কপিরাইট অনুমতির বিকল্প নয়।</p>
        <Link href="/terms" className="block text-amber-800 underline dark:text-amber-200" onClick={close}>শেয়ার ও কপিরাইট নীতিমালা পড়ুন</Link>
        <button type="button" onClick={close} className="min-h-12 w-full rounded-xl bg-[#a44b24] px-4 font-semibold text-white">বুঝেছি, গান পড়ি</button>
      </div>
    </Modal>
  </>;
}
