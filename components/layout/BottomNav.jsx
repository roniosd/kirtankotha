"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { House, Search, Heart, Plus, UserRound } from "lucide-react";
import { useApp } from "@/components/AppProvider";
const links = [
  { key: "home", href: "/", label: "সব গান", Icon: House },
  { key: "search", href: "/?focus=search#songs", label: "খুঁজুন", Icon: Search },
  { key: "favorites", href: "/?view=favorites#songs", label: "প্রিয় গান", Icon: Heart },
  { key: "mine", href: "/?view=mine#songs", label: "আমার গান", Icon: UserRound },
];
export default function BottomNav() {
  const path = usePathname(), params = useSearchParams();
  const { openUpload } = useApp();
  const view = params.get("view");
  const current = path !== "/" ? "" : ["mine", "favorites"].includes(view) ? view : params.get("focus") === "search" ? "search" : "home";
  function renderLink({ key, href, label, Icon }) {
    const active = current === key;
    return <Link key={key} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 ${active ? "bg-orange-100 font-bold text-orange-900 dark:bg-amber-400/15 dark:text-amber-200" : "font-medium text-stone-600 hover:bg-amber-50 dark:text-stone-400 dark:hover:bg-stone-800"}`}><Icon size={23} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" /><span className="whitespace-nowrap">{label}</span></Link>;
  }
  return <nav aria-label="প্রধান মেনু" className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-900/10 bg-[#fffdf8]/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(83,48,28,0.06)] backdrop-blur-xl dark:border-stone-700 dark:bg-stone-900/95 sm:hidden"><div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
    {links.slice(0, 2).map(renderLink)}
    <button type="button" onClick={openUpload} aria-label="নতুন গান যোগ করুন" className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold text-[#9f4924] focus-visible:outline-2 focus-visible:outline-amber-700 dark:text-amber-200"><span className="-mt-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-600 to-[#a44b24] text-white shadow-lg ring-4 ring-[#fffdf8] dark:ring-stone-900"><Plus size={27} strokeWidth={2.5} aria-hidden="true" /></span><span className="whitespace-nowrap">গান যোগ</span></button>
    {links.slice(2).map(renderLink)}
  </div></nav>;
}
