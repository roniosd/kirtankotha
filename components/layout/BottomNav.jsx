"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { House, Search, Heart, Plus } from "lucide-react";
import { useApp } from "@/components/AppProvider";
export default function BottomNav() {
  const path = usePathname(),
    params = useSearchParams();
  const { openUpload } = useApp();
  const current =
    path === "/"
      ? params.get("view") === "favorites"
        ? "favorites"
        : params.get("focus") === "search"
          ? "search"
          : "home"
      : "";
  const item =
    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-amber-800";
  return (
    <nav
      aria-label="প্রধান মেনু"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadcc6] bg-[#fffdf9]/98 px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {[
          { key: "home", href: "/", label: "সব গান", Icon: House },
          {
            key: "search",
            href: "/?focus=search#songs",
            label: "খুঁজুন",
            Icon: Search,
          },
          {
            key: "favorites",
            href: "/?view=favorites#songs",
            label: "প্রিয় গান",
            Icon: Heart,
          },
        ].map(({ key, href, label, Icon }) => (
          <Link
            key={key}
            href={href}
            aria-current={current === key ? "page" : undefined}
            className={`${item} ${current === key ? "bg-[#f8ead3] text-[#9f4924]" : "text-[#937b64]"}`}
          >
            <Icon size={22} strokeWidth={current === key ? 2.3 : 1.8} />
            {label}
          </Link>
        ))}
        <button onClick={openUpload} className={`${item} text-[#937b64]`}>
          <Plus size={24} />
          গান দিন
        </button>
      </div>
    </nav>
  );
}
