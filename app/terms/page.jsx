import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, MessageCircle, Flag } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import AppFooter from "@/components/layout/AppFooter";
export const metadata = { title: "শেয়ার ও কপিরাইট নীতিমালা — কীর্তনকথা", description: "গীতিকার পরিচয়, গান শেয়ার, মন্তব্য ও সংশোধন/অপসারণের অনুরোধের নিয়ম।" };
export default function TermsPage() {
  const contact = process.env.COPYRIGHT_CONTACT_EMAIL || "ronidev39@gmail.com";
  const sections = [
    { Icon: BookOpen, title: "গান শেয়ার করা ও গীতিকারের পরিচয়", text: "কীর্তনকথা বাংলা কীর্তন ও ভক্তিগীতির কমিউনিটি সংগ্রহ। যিনি গান জমা দেন, তিনি সংগ্রাহক বা শেয়ারকারী হতে পারেন; তাঁকে স্বয়ংক্রিয়ভাবে গীতিকার বা স্বত্বাধিকারী ধরা হয় না। নিজের লেখা গানও জমা দেওয়া যায়। জানা থাকলে প্রকৃত গীতিকারের নাম ও সংগ্রহের উৎস উল্লেখ করুন। নাম না জানা থাকলে খালি রাখুন; অনুমান করে কারও নাম দেবেন না।" },
    { Icon: ShieldCheck, title: "যা প্রকাশ করতে পারবেন", text: "আপনার নিজের লেখা, অধিকারীর অনুমতিপ্রাপ্ত, প্রযোজ্য লাইসেন্স মেনে প্রকাশযোগ্য বা আইনত ব্যবহারযোগ্য গান জমা দিন। ইন্টারনেট, সামাজিক মাধ্যম, বই বা ডায়েরিতে পাওয়া মানেই সেটি অবাধে প্রকাশ করা যাবে না। শুধু নাম উল্লেখ, ধর্মীয় উদ্দেশ্য বা ‘শেয়ার করার জন্য’ লেখা অনুমতির বিকল্প নয়। গীতিকারের নাম অজানা থাকলেও অনুমতির প্রয়োজন শেষ হয়ে যায় না।" },
    { Icon: ShieldCheck, title: "স্বত্ব ও সম্পাদনা", text: "গান জমা দেওয়ার কারণে কোনো তৃতীয় পক্ষের স্বত্ব জমাদাতা বা কীর্তনকথার কাছে চলে আসে না। জমাদাতা তাঁর অনুমোদিত লেখাটি এই সাইটে সংরক্ষণ ও প্রদর্শনের অনুমতি দেন। সাইটের লেখা ব্যবহারের আগে প্রয়োজনীয় অনুমতি নিজে নিশ্চিত করুন। নিজের জমা দেওয়া গান ও অ্যাডমিন ছাড়া অন্য কেউ সরাসরি গান সম্পাদনা করতে পারবেন না। তথ্য সংশোধনের জন্য মন্তব্য করুন; মন্তব্য মানেই তথ্যটি যাচাই করা হয়েছে নয়।" },
    { Icon: MessageCircle, title: "মন্তব্যের নিয়ম ও তথ্যের গোপনীয়তা", text: "গীতিকারের নাম, বানান, পাঠভেদ ও নির্ভরযোগ্য উৎস নিয়ে সম্মানজনক মন্তব্য করুন। মন্তব্য, প্রদর্শিত নাম ও গান-সংযোগ সাইটের ডাটাবেসে রাখা হয়; নাম ও মন্তব্য সবার কাছে দেখা যায়। ফোন নম্বর, ব্যক্তিগত ঠিকানা বা সংবেদনশীল নথি মন্তব্যে দেবেন না। স্প্যাম, অপমান, মিথ্যা দাবি ও অনুমতিহীন পূর্ণ লেখা পোস্ট করবেন না। নিজে নিজের মন্তব্য মুছতে পারবেন; অ্যাডমিন অনুপযুক্ত মন্তব্য সরাতে পারবেন।" },
  ];
  return <div className="min-h-dvh bg-[#fffcf5] text-stone-800 dark:bg-stone-950 dark:text-stone-100">
    <AppHeader reader />
    <main className="mx-auto max-w-3xl space-y-5 px-4 pt-7 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-8 sm:pb-10">
      <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-6 dark:from-amber-950 dark:via-stone-900 dark:to-rose-950"><p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200">সবার প্রতি সম্মান, সঠিক পরিচয়</p><h1 className="text-3xl font-semibold leading-relaxed">শেয়ার ও কপিরাইট নীতিমালা</h1><p className="mt-3 leading-8">গান ভালোবেসে শেয়ার করি, গীতিকার ও অধিকারীর স্বীকৃতি বজায় রাখি।</p></div>
      {sections.map(({ Icon, title, text }) => <section key={title} className="rounded-2xl border border-amber-100 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"><h2 className="flex items-start gap-3 text-xl font-semibold"><Icon size={24} className="mt-1 shrink-0 text-amber-700 dark:text-amber-300" />{title}</h2><p className="mt-3 text-base leading-8 text-stone-600 dark:text-stone-300">{text}</p></section>)}
      <section id="copyright" className="scroll-mt-48 rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/30"><h2 className="flex items-center gap-2 text-xl font-semibold"><Flag size={24} />সংশোধন বা অপসারণের অনুরোধ</h2><p className="mt-3 leading-8">আপনি গীতিকার, স্বত্বাধিকারী বা অনুমোদিত প্রতিনিধি হলে সংশ্লিষ্ট গানের লিংক, আপনার পরিচয় ও যোগাযোগ, দাবির কারণ এবং সমর্থনকারী উৎস/প্রমাণ ইমেইলে পাঠান। শুধু নাম সংশোধনের তথ্য মন্তব্যেও জানাতে পারেন। সংবেদনশীল প্রমাণ প্রকাশ্য মন্তব্যে দেবেন না। সাইট পরিচালকেরা অনুরোধ পর্যালোচনা করে প্রয়োজন অনুযায়ী সংশোধন বা অপসারণ করবেন।</p><a href={`mailto:${contact}?subject=${encodeURIComponent("কীর্তনকথা — কপিরাইট / সংশোধনের অনুরোধ")}`} className="mt-4 inline-flex min-h-12 max-w-full items-center rounded-xl bg-rose-700 px-4 py-3 text-sm font-semibold break-all text-white">অনুরোধ পাঠান: {contact}</a></section>
      <p className="text-sm leading-7 text-stone-500 dark:text-stone-400">এই নীতিমালা আইনগত অনুমতি বা কপিরাইটমুক্ত হওয়ার নিশ্চয়তা নয়। সাধারণ তথ্য: <a href="https://www.wipo.int/en/web/copyright/faq-copyright" target="_blank" rel="noopener noreferrer" className="underline">WIPO-এর কপিরাইট নির্দেশনা (নতুন ট্যাব)</a>।</p>
      <Link href="/" className="flex min-h-12 items-center justify-center rounded-xl bg-amber-700 font-semibold text-white">গানের তালিকায় ফিরুন</Link><AppFooter />
    </main>
    <Suspense><BottomNav /></Suspense>
  </div>;
}
