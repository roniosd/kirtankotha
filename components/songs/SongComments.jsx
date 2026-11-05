"use client";
import { useEffect, useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { canDeleteComment } from "@/lib/commentSchema";
import { inputClass } from "@/components/ui/Button";
export default function SongComments({ songId }) {
  const { user, setModal } = useApp();
  const [comments, setComments] = useState([]), [text, setText] = useState(""), [page, setPage] = useState(1), [hasMore, setHasMore] = useState(false), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [retry, setRetry] = useState(0), [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch(`/api/songs/${encodeURIComponent(songId)}/comments?page=${page}`, { signal: controller.signal, cache: "no-store" })
      .then(async r => { const data = await r.json(); if (!r.ok) throw Error(data.error); return data; })
      .then(data => { setComments(rows => page === 1 ? data.comments : [...new Map([...rows, ...data.comments].map(c => [c._id, c])).values()]); setHasMore(data.hasMore); })
      .catch(e => { if (e.name !== "AbortError") setError(e.message || "মন্তব্য লোড হয়নি।"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [songId, page, retry]);
  async function submit(e) {
    e.preventDefault(); if (busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const r = await fetch(`/api/songs/${songId}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await r.json(); if (!r.ok) throw Error(data.error);
      setText(""); setPage(1); setRetry(v => v + 1); setMessage("আপনার মন্তব্য যোগ হয়েছে। ধন্যবাদ!");
    } catch (e) { setError(e.message || "মন্তব্য জমা হয়নি।"); } finally { setBusy(false); }
  }
  async function remove(id) {
    if (busy || !window.confirm("এই মন্তব্য মুছে ফেলবেন?")) return;
    setBusy(true); setError("");
    try {
      const r = await fetch(`/api/songs/${songId}/comments/${id}`, { method: "DELETE" });
      const data = await r.json(); if (!r.ok) throw Error(data.error);
      setComments(rows => rows.filter(c => c._id !== id)); setMessage("মন্তব্য মুছে ফেলা হয়েছে।");
    } catch(e) { setError(e.message || "মন্তব্য মোছা হয়নি।"); } finally { setBusy(false); }
  }
  return <section id="comments" aria-labelledby="comments-title" className="mt-10 scroll-mt-48 rounded-3xl border border-sky-200 bg-sky-50/70 p-4 text-stone-800 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 sm:p-6">
    <h2 id="comments-title" className="flex items-center gap-2 text-xl font-semibold"><MessageCircle className="text-sky-700 dark:text-sky-300" />মন্তব্য ও গানের তথ্য</h2>
    <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">গীতিকারের নাম জানেন? সঠিক বানান বা উৎস জানা থাকলে এখানে লিখুন। মন্তব্যের তথ্য যাচাই করে গানে পরিবর্তন করা হবে।</p>
    {user ? <form onSubmit={submit} className="mt-4 space-y-3">
      <label htmlFor="song-comment" className="block text-sm font-semibold">আপনার মন্তব্য</label>
      <textarea id="song-comment" value={text} onChange={e => setText(e.target.value)} required minLength={2} maxLength={1000} rows={4} placeholder="যেমন: এই গানের গীতিকার…, উৎস…" className={`${inputClass} resize-y`} />
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-stone-500 dark:text-stone-400">{text.length}/১০০০ · মন্তব্য সবার কাছে দেখা যাবে</span><button disabled={busy || text.trim().length < 2} className="flex min-h-12 items-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white hover:bg-sky-800 disabled:opacity-50"><Send size={18} />{busy ? "অপেক্ষা করুন…" : "মন্তব্য দিন"}</button></div>
    </form> : <button type="button" onClick={() => setModal("account")} className="mt-4 min-h-12 rounded-xl bg-sky-700 px-5 font-semibold text-white">মন্তব্য করতে লগইন করুন</button>}
    {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">{error} <button type="button" onClick={() => setRetry(v => v + 1)} className="min-h-11 px-2 underline">আবার চেষ্টা করুন</button></div>}
    {message && <p role="status" className="mt-3 text-sm text-teal-700 dark:text-teal-300">{message}</p>}
    <div className="mt-5 space-y-3">
      {comments.map(comment => <article key={comment._id} className="rounded-2xl border border-sky-100 bg-white p-4 dark:border-stone-700 dark:bg-stone-900"><div className="flex items-center justify-between gap-2"><h3 className="break-words font-semibold">{comment.name}</h3>{canDeleteComment(user, comment) && <button type="button" disabled={busy} onClick={() => remove(comment._id)} aria-label={`${comment.name}-এর মন্তব্য মুছুন`} className="flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950"><Trash2 size={17} />মুছুন</button>}</div><p className="mt-2 whitespace-pre-wrap break-words text-base leading-8">{comment.text}</p></article>)}
      {loading && <p role="status" className="py-4 text-sm">মন্তব্য লোড হচ্ছে…</p>}
      {!loading && !error && comments.length === 0 && <p className="py-3 text-sm text-stone-500 dark:text-stone-400">এখনো মন্তব্য নেই। আপনার জানা তথ্য প্রথমে জানান।</p>}
    </div>
    {hasMore && !loading && !error && <button type="button" onClick={() => setPage(v => v + 1)} className="mt-4 min-h-12 w-full rounded-xl border border-sky-300 font-semibold dark:border-stone-600">আরও মন্তব্য দেখুন</button>}
  </section>;
}
