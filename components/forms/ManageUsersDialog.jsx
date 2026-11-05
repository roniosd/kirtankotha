"use client";
import { useEffect, useState } from "react";
import { Search, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import Modal from "@/components/ui/Modal";
import { inputClass, secondaryClass } from "@/components/ui/Button";
import { bn } from "@/lib/songFilters";
export default function ManageUsersDialog() {
  const { modal, setModal, user, setNotice } = useApp();
  const [users, setUsers] = useState([]),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [loading, setLoading] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [selected, setSelected] = useState(null),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (modal !== "users" || user?.role !== "admin") return;
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      fetch(`/api/admin/users?q=${encodeURIComponent(query)}&page=${page}`, {
        signal: ctrl.signal,
      })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw Error(d.error);
          setUsers(d.users);
          setTotal(d.total);
        })
        .catch((err) => {
          if (err.name !== "AbortError")
            setError(err.message || "তালিকা লোড হয়নি।");
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [modal, user, query, page, refresh]);
  async function remove() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      {
        const r = await fetch(`/api/admin/users/${selected._id}`, {
          method: "DELETE",
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
      }
      setSelected(null);
      setRefresh((v) => v + 1);
      setNotice("ব্যবহারকারীর অ্যাকাউন্ট বন্ধ করা হয়েছে।");
    } catch (err) {
      setError(err.message || "মুছতে পারিনি।");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={modal === "users"}
      onClose={() => {
        if (!busy) {
          setModal(null);
          setSelected(null);
          setError("");
        }
      }}
      title="ব্যবহারকারী পরিচালনা"
    >
      {user?.role !== "admin" ? (
        <p>অ্যাডমিন অনুমতি প্রয়োজন।</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-stone-500 dark:text-stone-400">
            শুধু অ্যাডমিন এই তালিকা দেখতে পারেন।
          </p>
          <label className="flex items-center gap-2">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন"
              aria-label="ব্যবহারকারী খুঁজুন"
              className={inputClass}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="text-red-700 dark:text-red-300 dark:text-red-300"
            >
              {error}
            </p>
          )}
          {selected ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 p-4 dark:border-red-900 dark:bg-red-950/40">
              <h3 className="font-semibold">
                {selected.name || selected.email}—অ্যাকাউন্ট মুছবেন?
              </h3>
              <p className="mt-2 text-sm leading-6">
                এই ব্যবহারকারী আর লগইন করতে পারবেন না। তাঁর গানগুলো থাকবে; আপনি
                সেগুলো পরিচালনা করতে পারবেন।
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => setSelected(null)}
                  className={secondaryClass}
                >
                  না, থাক
                </button>
                <button
                  disabled={busy}
                  onClick={remove}
                  className="min-h-12 rounded-2xl bg-red-700 px-4 font-medium text-white"
                >
                  {busy ? "বন্ধ হচ্ছে…" : "হ্যাঁ, অ্যাকাউন্ট মুছুন"}
                </button>
              </div>
            </div>
          ) : null}
          <p className="text-sm text-stone-500 dark:text-stone-400 dark:text-stone-400">
            {loading ? "লোড হচ্ছে…" : `${bn(total)} জন ব্যবহারকারী`}
          </p>
          <ul className="space-y-2">
            {users.map((target) => (
              <li
                key={target._id}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-3 dark:border-stone-700 dark:bg-stone-900"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {target.name || "নাম দেওয়া হয়নি"}
                  </p>
                  <p className="break-all text-xs text-stone-500 dark:text-stone-400 dark:text-stone-400">
                    {target.email}
                  </p>
                </div>
                {target._id === user._id ? (
                  <span className="text-xs text-amber-800 dark:text-amber-100 dark:text-amber-200">
                    আপনি
                  </span>
                ) : (
                  <button
                    disabled={busy}
                    onClick={() => setSelected(target)}
                    aria-label={`${target.email} অ্যাকাউন্ট মুছুন`}
                    className="flex min-h-11 items-center gap-1 rounded-xl bg-red-50 dark:bg-red-950/40 px-3 text-sm text-red-700 dark:text-red-300 dark:bg-red-950/40 dark:text-red-300"
                  >
                    <Trash2 size={16} />
                    মুছুন
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!loading && !users.length && !error && (
            <p className="py-4 text-center">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
          )}
          {total > 20 && (
            <div className="flex justify-between gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className={secondaryClass}
              >
                <ArrowLeft size={17} />
                আগের
              </button>
              <span className="self-center text-sm">{bn(page)}</span>
              <button
                disabled={page * 20 >= total || loading}
                onClick={() => setPage((p) => p + 1)}
                className={secondaryClass}
              >
                পরের
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
