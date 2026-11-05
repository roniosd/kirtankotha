"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { demoSongs } from "@/lib/songs";
import AccountDialog from "@/components/forms/AccountDialog";
import UploadDialog from "@/components/forms/UploadDialog";
import { X } from "lucide-react";
export const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const Context = createContext(null);
export const useApp = () => useContext(Context);
const readLocal = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
export default function AppProvider({ children }) {
  const [songs, setSongs] = useState(isDemo ? demoSongs : []),
    [loading, setLoading] = useState(!isDemo),
    [loadError, setLoadError] = useState(""),
    [user, setUser] = useState(null),
    [authLoading, setAuthLoading] = useState(!isDemo),
    [favorites, setFavorites] = useState([]),
    [favoritesReady, setFavoritesReady] = useState(isDemo),
    [favoriteBusy, setFavoriteBusy] = useState(false),
    [favoritesError, setFavoritesError] = useState(""),
    [favoritesRetry, setFavoritesRetry] = useState(0),
    [modal, setModal] = useState(null),
    [notice, setNotice] = useState("");
  const pending = useRef(false),
    userRef = useRef(user);
  userRef.current = user;
  const refreshSongs = useCallback(async () => {
    if (isDemo) return;
    setLoading(true);
    setLoadError("");
    try {
      const r = await fetch("/api/songs", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "গান লোড করা যায়নি।");
      setSongs(d.songs || []);
    } catch {
      setLoadError("গান লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (isDemo) {
      const saved = readLocal("kirtan-demo-favorites", []);
      setFavorites(
        Array.isArray(saved) ? saved.filter((x) => typeof x === "string") : [],
      );
      return;
    }
    refreshSongs();
    let active = true;
    fetch("/api/auth", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        if (active) setUser(d.user || null);
      })
      .catch(() => {
        if (active) setNotice("অ্যাকাউন্ট লোড করা যায়নি। আবার লগইন করে দেখুন।");
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshSongs]);
  useEffect(() => {
    if (isDemo) return;
    let active = true;
    setFavorites([]);
    setFavoritesReady(false);
    setFavoritesError("");
    if (!user) return;
    fetch("/api/favorites", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        if (active) {
          setFavorites(d.favorites || []);
          setFavoritesReady(true);
        }
      })
      .catch(() => {
        if (active)
          setFavoritesError("প্রিয় গানের তালিকা লোড হয়নি। আবার চেষ্টা করুন।");
      });
    return () => {
      active = false;
    };
  }, [user, favoritesRetry]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  async function toggleFavorite(songId) {
    if (!isDemo && !user) {
      setModal("account");
      return;
    }
    if (pending.current || !favoritesReady) return;
    const favorite = !favorites.includes(songId);
    if (isDemo) {
      const next = favorite
        ? [...favorites, songId]
        : favorites.filter((id) => id !== songId);
      setFavorites(next);
      try {
        localStorage.setItem("kirtan-demo-favorites", JSON.stringify(next));
      } catch {}
      setNotice(
        favorite ? "প্রিয় গানে রাখা হয়েছে।" : "প্রিয় তালিকা থেকে সরানো হয়েছে।",
      );
      return;
    }
    pending.current = true;
    setFavoriteBusy(true);
    const owner = user?._id;
    try {
      const r = await fetch("/api/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId, favorite }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      if (userRef.current?._id === owner) {
        setFavorites(d.favorites || []);
        setNotice(
          favorite
            ? "প্রিয় গানে রাখা হয়েছে।"
            : "প্রিয় তালিকা থেকে সরানো হয়েছে।",
        );
      }
    } catch (err) {
      setNotice(err.message || "সংরক্ষণ হয়নি। আবার চেষ্টা করুন।");
    } finally {
      pending.current = false;
      setFavoriteBusy(false);
    }
  }
  async function logout() {
    try {
      const r = await fetch("/api/auth", { method: "DELETE" });
      if (!r.ok) throw Error();
      setUser(null);
      setFavorites([]);
      setModal(null);
      setNotice("লগআউট হয়েছে।");
    } catch {
      setNotice("লগআউট হয়নি। আবার চেষ্টা করুন।");
    }
  }
  const openUpload = () => setModal(user || isDemo ? "upload" : "account");
  const value = {
    songs,
    setSongs,
    loading,
    loadError,
    refreshSongs,
    user,
    setUser,
    authLoading,
    favorites,
    favoritesReady,
    favoritesError,
    refreshFavorites: () => setFavoritesRetry(v => v + 1),
    favoriteBusy,
    toggleFavorite,
    modal,
    setModal,
    notice,
    setNotice,
    logout,
    openUpload,
  };
  return (
    <Context.Provider value={value}>
      {children}
      <AccountDialog />
      <UploadDialog />
      {notice && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-25 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber-200 bg-[#fff8e8] p-4 text-sm text-[#63391d] shadow-xl sm:bottom-6"
        >
          <span className="flex-1">{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="বার্তা বন্ধ করুন"
            className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-amber-100"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
