"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { plainTextToRichDoc } from "@/lib/richLyrics";
import { categories } from "@/lib/songs";
import dynamic from "next/dynamic";
const LyricsEditor = dynamic(() => import("./LyricsEditor"), { ssr: false });
import Modal from "@/components/ui/Modal";
import Button, { inputClass } from "@/components/ui/Button";
export default function UploadDialog() {
  const { modal, setModal, setSongs, setNotice, editSong, setEditSong } =
    useApp();
  const [editorValue, setEditorValue] = useState({
    lyrics: "",
    lyricsContent: null,
  });
  const [editorKey, setEditorKey] = useState(0);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (modal === "upload") {
      setError("");
      setEditorValue({
        lyrics: editSong?.lyrics || "",
        lyricsContent:
          editSong?.lyricsContent || plainTextToRichDoc(editSong?.lyrics || ""),
      });
      setEditorKey((key) => key + 1);
    }
  }, [modal, editSong]);
  const close = () => {
    setEditSong(null);
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
    setBusy(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch(
        editSong ? `/api/songs/${editSong._id}` : "/api/songs",
        {
          method: editSong ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, ...editorValue, rightsConfirmed: true }),
        },
      );
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setSongs((s) =>
        editSong
          ? s.map((song) => (song._id === editSong._id ? d.song : song))
          : [d.song, ...s],
      );
      setNotice(
        editSong
          ? "গানের পরিবর্তন সংরক্ষিত হয়েছে।"
          : "আপনার গানটি যোগ হয়েছে। ধন্যবাদ!",
      );
      close();
    } catch (err) {
      setError(err.message || "গান যোগ হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={modal === "upload"}
      onClose={close}
      title={editSong ? "গান সম্পাদনা করুন" : "নতুন গান যোগ করুন"}
    >
      <p className="mb-5 leading-7 text-stone-600 dark:text-stone-400">
        নিজের লেখা বা অনুমতি নিয়ে সংগৃহীত গান শেয়ার করুন। জমাদাতা ও গীতিকার আলাদা পরিচয়।
      </p>
      <form
        key={editSong?._id || "new"}
        onSubmit={submit}
        className="space-y-4"
      >
        <label className="block space-y-2">
          <span>গানের নাম</span>
          <input
            name="title"
            defaultValue={editSong?.title || ""}
            required
            minLength={2}
            maxLength={120}
            placeholder="যেমন: হরে কৃষ্ণ মহামন্ত্র"
            className={inputClass}
          />
        </label>
        <label className="block space-y-2">
          <span>আপনি কী শেয়ার করছেন?</span>
          <select name="contributionType" defaultValue={editSong?.contributionType || "collected"} className={inputClass}>
            <option value="collected">সংগৃহীত গান — অন্যের লেখা</option>
            <option value="original">নিজের লেখা গান</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span>গীতিকারের নাম <small className="text-stone-500">(ঐচ্ছিক)</small></span>
          <input name="lyricist" maxLength={120} defaultValue={editSong?.lyricist || ""} placeholder="যিনি গানটি লিখেছেন; জানা না থাকলে খালি রাখুন" className={inputClass} />
        </label>
       
        <label className="block space-y-2">
          <span>কোন বিভাগ?</span>
          <select
            defaultValue={editSong?.category}
            name="category"
            required
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span>গানের ধরন</span>
          <select
            defaultValue={editSong?.type}
            name="type"
            className={inputClass}
          >
            <option>কীর্তন</option>
            <option>গান</option>
          </select>
        </label>
        <div className="space-y-2">
          <p className="font-medium">গানের কথা</p>
          <p
            id="lyrics-editor-help"
            className="text-sm leading-6 text-stone-500 dark:text-stone-400"
          >
            নিচে গান লিখুন। কোনো লেখা সাজাতে সেটি বেছে নিয়ে ওপরের বোতামে চাপ
            দিন। নতুন স্তবকের জন্য Enter চাপুন।
          </p>
          {modal === "upload" && (
            <LyricsEditor
              key={editorKey}
              onChange={setEditorValue}
              initialContent={
                editSong?.lyricsContent ||
                plainTextToRichDoc(editSong?.lyrics || "")
              }
            />
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-red-800 dark:text-red-300"
          >
            {error}
          </p>
        )}
        <label className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm leading-7 dark:bg-amber-950/30">
          <input type="checkbox" required className="mt-1.5 size-5 shrink-0 accent-amber-700" />
          <span>আমার এই গান প্রকাশের অধিকার/অনুমতি আছে বা ব্যবহারটি আইনত অনুমোদিত। আমি <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold underline">শেয়ার ও কপিরাইট নীতিমালা (নতুন ট্যাব)</Link> মেনে চলব।</span>
        </label>
        <Button disabled={busy} className="w-full">
          <Plus size={20} />
          {busy
            ? "সংরক্ষণ হচ্ছে…"
            : editSong
              ? "পরিবর্তন রাখুন"
              : "গান জমা দিন"}
        </Button>
      </form>
    </Modal>
  );
}
