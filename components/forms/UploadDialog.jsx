"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useApp, isDemo } from "@/components/AppProvider";
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
    if (isDemo && editSong) {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      setSongs((s) =>
        s.map((song) =>
          song._id === editSong._id
            ? { ...song, ...fields, ...editorValue }
            : song,
        ),
      );
      setNotice("ডেমো গান আপডেট হয়েছে—শুধু এই ব্রাউজারে।");
      close();
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
      const r = await fetch(
        editSong ? `/api/songs/${editSong._id}` : "/api/songs",
        {
          method: editSong ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, ...editorValue }),
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
        গানের নাম, বিভাগ ও সম্পূর্ণ কথা লিখুন।
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
