"use client";
import Link from "next/link";
import { useState } from "react";
import { LogOut, UserRound, ArrowRight } from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
import Modal from "@/components/ui/Modal";
import Button, { inputClass, secondaryClass } from "@/components/ui/Button";
export default function AccountDialog() {
  const { modal, setModal, user, setUser, logout } = useApp();
  const [signup, setSignup] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const close = () => {
    setModal(null);
    setError("");
  };
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (isDemo) {
      setError("এটি ডেমো। আসল অ্যাকাউন্ট খুলতে MongoDB-সহ সোর্স কোড চালান।");
      return;
    }
    setBusy(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, action: signup ? "signup" : "signin" }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setUser(d.user);
      close();
    } catch (err) {
      setError(err.message || "আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={modal === "account"}
      onClose={close}
      title={
        user ? "আমার অ্যাকাউন্ট" : signup ? "নতুন অ্যাকাউন্ট" : "লগইন করুন"
      }
    >
      {user ? (
        <div className="space-y-5">
          <UserRound className="text-amber-800 dark:text-amber-100" size={32} />
          <p className="text-xl font-medium">{user.name || "স্বাগতম"}</p>
          <p className="break-all text-stone-600 dark:text-stone-400">
            {user.email}
          </p>
          <Link
            href="/?view=mine#songs"
            onClick={close}
            className={`${secondaryClass} w-full`}
          >
            আমার গান দেখুন
          </Link>
          {user.role === "admin" && (
            <button
              onClick={() => setModal("users")}
              className={`${secondaryClass} w-full`}
            >
              সব ব্যবহারকারী পরিচালনা
            </button>
          )}
          {isDemo && (
            <p className="text-sm text-amber-900 dark:text-amber-100 dark:text-amber-200">
              ডেমো: পরিবর্তন শুধু এই ব্রাউজারে থাকে।
            </p>
          )}
          <button onClick={logout} className={`${secondaryClass} w-full`}>
            <LogOut size={20} />
            লগআউট করুন
          </button>
        </div>
      ) : (
        <>
          <p className="mb-5 text-base leading-7 text-stone-600 dark:text-stone-400">
            প্রিয় গান রাখতে ও নতুন গান যোগ করতে লগইন করুন।
          </p>
          <form onSubmit={submit} className="space-y-4">
            {signup && (
              <label className="block space-y-2">
                <span>
                  আপনার নাম{" "}
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    (না দিলেও হবে)
                  </span>
                </span>
                <input
                  name="name"
                  maxLength={60}
                  autoComplete="name"
                  className={inputClass}
                />
              </label>
            )}
            <label className="block space-y-2">
              <span>ইমেইল</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
            <label className="block space-y-2">
              <span>পাসওয়ার্ড</span>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-red-800 dark:text-red-300"
              >
                {error}
              </p>
            )}
            <Button disabled={busy} className="w-full">
              {busy
                ? "অপেক্ষা করুন…"
                : signup
                  ? "অ্যাকাউন্ট খুলুন"
                  : "লগইন করুন"}
              <ArrowRight size={20} />
            </Button>
          </form>
          <button
            type="button"
            onClick={() => {
              setSignup(!signup);
              setError("");
            }}
            className="mt-4 min-h-12 w-full rounded-xl text-center font-medium text-amber-900 dark:text-amber-100 underline underline-offset-4"
          >
            {signup
              ? "অ্যাকাউন্ট আছে? লগইন করুন"
              : "অ্যাকাউন্ট নেই? নতুন খুলুন"}
          </button>
        </>
      )}
    </Modal>
  );
}
