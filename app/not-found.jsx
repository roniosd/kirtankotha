import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-3xl font-semibold">গানটি পাওয়া যায়নি</h1>
      <p className="mt-4 leading-7 text-stone-500">
        ঠিকানাটি বদলে যেতে পারে। তালিকা থেকে আপনার গান খুঁজে নিন।
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex min-h-13 items-center rounded-2xl bg-[#a44b24] px-6 font-medium text-white"
      >
        সব গান দেখুন
      </Link>
    </main>
  );
}
