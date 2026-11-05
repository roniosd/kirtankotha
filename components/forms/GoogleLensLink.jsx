import { ScanText, ExternalLink } from "lucide-react";

export default function GoogleLensLink() {
  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-stone-700 dark:bg-stone-900">
      <a href="https://lens.google.com/" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
        <ScanText size={22} aria-hidden="true" /> Google Lens খুলুন <ExternalLink size={18} aria-hidden="true" />
        <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
      </a>
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">Google Lens-এ ছবি স্ক্যান করে লেখা কপি করুন। তারপর এখানে ফিরে গানের ঘরে পেস্ট করুন।</p>
    </div>
  );
}
