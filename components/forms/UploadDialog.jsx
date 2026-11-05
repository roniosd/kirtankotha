"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
import { categories } from "@/lib/songs";
import dynamic from "next/dynamic";
const LyricsEditor = dynamic(() => import("./LyricsEditor"), { ssr: false });
import Modal from "@/components/ui/Modal";
import Button, { inputClass } from "@/components/ui/Button";
export default function UploadDialog() {
  const { modal, setModal, setSongs, setNotice } = useApp();
  const [editorValue, setEditorValue] = useState({
    lyrics: "",
    lyricsContent: null,
  });
  const [editorKey, setEditorKey] = useState(0);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const close = () => {
    setModal(null);
    setError("");
    setEditorValue({ lyrics: "", lyricsContent: null });
    setEditorKey((key) => key + 1);
  };
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (
      editorValue.lyrics.trim().length < 10 ||
      editorValue.lyrics.trim().length > 20000
    ) {
      setError("গানের কথা ১০ থেকে ২০,০০০ অক্ষরের মধ্যে লিখুন।");
      return;
    }
    if (isDemo) {
      setError(
        "ডেমোতে গান জমা হয় না। MongoDB সংযুক্ত প্রজেক্টে এই ফর্ম কাজ করবে।",
      );
      return;
    }
    setBusy(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...editorValue }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setSongs((s) => [d.song, ...s]);
      setNotice("আপনার গানটি যোগ হয়েছে। ধন্যবাদ!");
      close();
    } catch (err) {
      setError(err.message || "গান যোগ হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={modal === "upload"} onClose={close} title="নতুন গান যোগ করুন">
      <p className="mb-5 leading-7 text-stone-600">
        গানের নাম, বিভাগ ও সম্পূর্ণ কথা লিখুন।
      </p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-2">
          <span>গানের নাম</span>
          <input
            name="title"
            required
            minLength={2}
            maxLength={120}
            placeholder="যেমন: হরে কৃষ্ণ মহামন্ত্র"
            className={inputClass}
          />
        </label>
        <label className="block space-y-2">
          <span>কোন বিভাগ?</span>
          <select name="category" required className={inputClass}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span>গানের ধরন</span>
          <select name="type" className={inputClass}>
            <option>কীর্তন</option>
            <option>গান</option>
          </select>
        </label>
        <div className="space-y-2">
          <p className="font-medium">গানের কথা</p>
          <p
            id="lyrics-editor-help"
            className="text-sm leading-6 text-stone-500"
          >
            নিচে গান লিখুন। কোনো লেখা সাজাতে সেটি বেছে নিয়ে ওপরের বোতামে চাপ
            দিন। নতুন স্তবকের জন্য Enter চাপুন।
          </p>
          {modal === "upload" && <LyricsEditor key={editorKey} onChange={setEditorValue} />}
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">
            {error}
          </p>
        )}
        <Button disabled={busy} className="w-full">
          <Plus size={20} />
          {busy ? "গান যোগ হচ্ছে…" : "গান জমা দিন"}
        </Button>
      </form>
    </Modal>
  );
}
