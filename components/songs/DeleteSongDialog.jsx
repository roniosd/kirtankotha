"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import Modal from "@/components/ui/Modal";
import { secondaryClass } from "@/components/ui/Button";
export default function DeleteSongDialog() {
  const {
    modal,
    setModal,
    selectedSong,
    setSongs,
    setFavorites,
    setNotice,
    canManage,
  } = useApp();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  const close = () => {
    if (!busy) {
      setModal(null);
      setError("");
    }
  };
  async function remove() {
    if (!selectedSong || !canManage(selectedSong)) return;
    setBusy(true);
    setError("");
    try {
        const r = await fetch(`/api/songs/${selectedSong._id}`, {
          method: "DELETE",
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
      setSongs((s) => s.filter((song) => song._id !== selectedSong._id));
      setFavorites((f) => f.filter((id) => id !== selectedSong._id));
      setNotice("গানটি সরানো হয়েছে।");
      setModal(null);
      if (window.location.pathname.startsWith("/songs/"))
        router.push("/#songs");
    } catch (err) {
      setError(err.message || "মুছতে পারিনি।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={modal === "deleteSong"} onClose={close} title="গানটি মুছবেন?">
      <p className="text-lg font-semibold">{selectedSong?.title}</p>
      <p className="mt-3 leading-7 text-stone-600 dark:text-stone-400 dark:text-stone-300">
        গানটি সবার তালিকা থেকে সরবে। জমা দেওয়া তথ্য ডাটাবেসে সংরক্ষিত থাকবে।
      </p>
      {error && (
        <p
          role="alert"
          className="mt-3 text-red-700 dark:text-red-300 dark:text-red-300"
        >
          {error}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button disabled={busy} onClick={close} className={secondaryClass}>
          থাক, মুছব না
        </button>
        <button
          disabled={busy}
          onClick={remove}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-700 px-4 font-semibold text-white disabled:opacity-50"
        >
          <Trash2 size={18} />
          {busy ? "সরানো হচ্ছে…" : "হ্যাঁ, মুছুন"}
        </button>
      </div>
    </Modal>
  );
}
