"use client";
import { useEffect, useRef, useState } from "react";
import {
  ScanText,
  Camera,
  ImagePlus,
  X,
  Plus,
  Copy,
  LoaderCircle,
} from "lucide-react";
import { secondaryClass, inputClass } from "@/components/ui/Button";
import { bn } from "@/lib/songFilters";
export default function ImageTextScanner({ onInsertText }) {
  const [open, setOpen] = useState(false),
    [file, setFile] = useState(null),
    [preview, setPreview] = useState(""),
    [language, setLanguage] = useState("ben"),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(null),
    [text, setText] = useState(""),
    [error, setError] = useState(""),
    [status, setStatus] = useState("");
  const workerRef = useRef(null),
    run = useRef(0),
    camera = useRef(null),
    gallery = useRef(null);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(
    () => () => {
      run.current++;
      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [],
  );
  const cancel = () => {
    run.current++;
    workerRef.current?.terminate();
    workerRef.current = null;
    setBusy(false);
    setStatus("স্ক্যান বন্ধ হয়েছে।");
  };
  function select(e) {
    const value = e.target.files?.[0];
    e.target.value = "";
    if (!value) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(value.type) ||
      value.size > 10 * 1024 * 1024
    ) {
      setError("JPG, PNG বা WebP ছবি দিন; সর্বোচ্চ ১০ MB।");
      return;
    }
    setFile(value);
    setText("");
    setError("");
    setStatus("");
  }
  async function recognize() {
    if (!file || busy) return;
    const token = ++run.current;
    setBusy(true);
    setError("");
    setProgress(null);
    setStatus("ছবি পড়ার উপকরণ লোড হচ্ছে…");
    let worker;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(language, 1, {
        workerPath: "/ocr/worker.min.js",
        corePath: "/ocr/core",
        langPath: "/ocr/lang",
        logger: (message) => {
          if (run.current !== token) return;
          if (message.status === "recognizing text") {
            setStatus("ছবির লেখা পড়া হচ্ছে…");
            setProgress(message.progress);
          }
        },
      });
      if (run.current !== token) {
        await worker.terminate();
        return;
      }
      workerRef.current = worker;
      const result = await worker.recognize(file);
      if (run.current !== token) return;
      const found = result.data.text.trim();
      setText(found.slice(0, 20000));
      setStatus(
        found
          ? "লেখা পাওয়া গেছে। ভুল থাকলে ঠিক করে নিন।"
          : "স্পষ্ট লেখা পাওয়া যায়নি। আরও পরিষ্কার ছবি দিন।",
      );
      if (found.length > 20000)
        setError("অনেক লেখা পাওয়া গেছে; প্রথম ২০,০০০ অক্ষর দেখানো হচ্ছে।");
    } catch (error) {
      console.error("OCR failed:", error);
      if (run.current === token)
        setError(
          "ছবি পড়া যায়নি। পরিষ্কার ছবি ও ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।",
        );
    } finally {
      if (worker) await worker.terminate().catch(() => {});
      if (run.current === token) {
        workerRef.current = null;
        setBusy(false);
      }
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("লেখা কপি হয়েছে।");
    } catch {
      setError("কপি হয়নি। নিচের লেখা বেছে নিয়ে কপি করুন।");
    }
  }
  return (
    <section className="mb-3 rounded-2xl border border-amber-200 dark:border-stone-700 bg-amber-50/60 p-3 dark:border-stone-700 dark:bg-stone-800">
      <button
        type="button"
        onClick={() => {
          if (open && busy) cancel();
          setOpen(!open);
        }}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-2 text-left font-medium text-amber-900 dark:text-amber-100 dark:text-amber-100"
      >
        <span className="flex items-center gap-2">
          <ScanText size={23} />
          ছবি থেকে লেখা তুলুন
        </span>
        {open ? <X size={20} /> : <Plus size={20} />}
      </button>
      {open && (
        <div className="space-y-3 pt-2">
          <p className="text-sm leading-6 text-stone-600 dark:text-stone-400 dark:text-stone-300">
            গানের বইয়ের ছবি দিন বা ক্যামেরায় তুলুন। ছবি এই ব্রাউজারেই পড়া হবে;
            সার্ভারে পাঠানো হবে না।
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => camera.current?.click()}
              className={secondaryClass}
            >
              <Camera size={20} />
              ছবি তুলুন
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => gallery.current?.click()}
              className={secondaryClass}
            >
              <ImagePlus size={20} />
              ছবি বাছুন
            </button>
          </div>
          <input
            ref={camera}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={select}
            className="hidden"
            aria-label="ক্যামেরায় গানের ছবি তুলুন"
          />
          <input
            ref={gallery}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={select}
            className="hidden"
            aria-label="গানের ছবি বাছুন"
          />
          {preview && (
            <img
              src={preview}
              alt="স্ক্যানের জন্য বেছে নেওয়া গানের ছবি"
              className="max-h-48 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 object-contain dark:border-stone-700"
            />
          )}
          <label className="block space-y-1 text-sm">
            <span>ছবির ভাষা</span>
            <select
              aria-label="ছবির ভাষা"
              value={language}
              disabled={busy}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputClass}
            >
              <option value="ben">বাংলা</option>
              <option value="ben+eng">বাংলা ও ইংরেজি</option>
              <option value="eng">ইংরেজি</option>
            </select>
          </label>
          <button
            type="button"
            disabled={!file || busy}
            onClick={recognize}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a44b24] px-3 font-medium text-white disabled:opacity-40"
          >
            {busy ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <ScanText size={20} />
            )}
            লেখা পড়ুন
          </button>
          {busy && (
            <div className="space-y-2">
              <progress
                aria-label="ছবি থেকে লেখা পড়ার অগ্রগতি"
                value={progress ?? undefined}
                max={1}
                className="h-2 w-full accent-amber-700"
              />
              <button
                type="button"
                onClick={cancel}
                className="min-h-11 rounded-xl px-3 text-sm text-red-700 dark:text-red-300 dark:text-red-300"
              >
                স্ক্যান বন্ধ করুন
              </button>
            </div>
          )}
          {status && (
            <p
              role="status"
              className="text-sm leading-6 text-amber-900 dark:text-amber-100 dark:text-amber-200"
            >
              {status}
              {busy && progress !== null
                ? ` ${bn(Math.round(progress * 100))}%`
                : ""}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="text-sm leading-6 text-red-700 dark:text-red-300 dark:text-red-300"
            >
              {error}
            </p>
          )}
          {text && (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium">
                  পাওয়া লেখা—ভুল থাকলে ঠিক করুন
                </span>
                <textarea
                  value={text}
                  maxLength={20000}
                  onChange={(e) => setText(e.target.value)}
                  rows={7}
                  className={`${inputClass} leading-8`}
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={copy} className={secondaryClass}>
                  <Copy size={18} />
                  কপি করুন
                </button>
                <button
                  type="button"
                  disabled={!text.trim()}
                  onClick={() => {
                    onInsertText(text.trim());
                    setText("");
                    setOpen(false);
                  }}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#a44b24] px-3 font-medium text-white"
                >
                  <Plus size={18} />
                  গানে বসান
                </button>
              </div>
              <p className="text-xs leading-5 text-stone-500 dark:text-stone-400 dark:text-stone-400">
                ছবি ঝাপসা বা হাতে লেখা হলে ভুল হতে পারে। জমা দেওয়ার আগে মিলিয়ে
                নিন।
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
