"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AccountDialog from "@/components/forms/AccountDialog";
import UploadDialog from "@/components/forms/UploadDialog";
import { canManageSong } from "@/lib/permissions";
import DeleteSongDialog from "@/components/songs/DeleteSongDialog";
import ManageUsersDialog from "@/components/forms/ManageUsersDialog";
import { X } from "lucide-react";
const Context = createContext(null);
export const useApp = () => useContext(Context);
export default function AppProvider({ children }) {
  const [songs, setSongs] = useState([]),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(""),
    [user, setUser] = useState(null),
    [authLoading, setAuthLoading] = useState(true),
    [favorites, setFavorites] = useState([]),
    [favoritesReady, setFavoritesReady] = useState(false),
    [favoriteBusy, setFavoriteBusy] = useState(false),
    [favoritesError, setFavoritesError] = useState(""),
    [favoritesRetry, setFavoritesRetry] = useState(0),
    [editSong, setEditSong] = useState(null),
    [selectedSong, setSelectedSong] = useState(null),
    [modal, setModal] = useState(null),
    [notice, setNotice] = useState("");
  const pending = useRef(false),
    userRef = useRef(user);
  userRef.current = user;
  const refreshSongs = useCallback(async () => {
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
    if (!user) {
      setModal("account");
      return;
    }
    if (pending.current || !favoritesReady) return;
    const favorite = !favorites.includes(songId);
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
  const canManage = (song) => canManageSong(user, song);
  const openUpload = () => {
    setEditSong(null);
    setModal(user ? "upload" : "account");
  };
  const openEdit = (song) => {
    if (canManage(song)) {
      setEditSong(song);
      setModal("upload");
    }
  };
  const requestDelete = (song) => {
    if (canManage(song)) {
      setSelectedSong(song);
      setModal("deleteSong");
    }
  };
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
    refreshFavorites: () => setFavoritesRetry((v) => v + 1),
    favoriteBusy,
    toggleFavorite,
    modal,
    setModal,
    notice,
    setNotice,
    logout,
    openUpload,
    openEdit,
    requestDelete,
    canManage,
    editSong,
    setEditSong,
    selectedSong,
    setFavorites,
  };
  return (
    <Context.Provider value={value}>
      {children}
      <AccountDialog />
      <UploadDialog />
      <DeleteSongDialog />
      <ManageUsersDialog />
      {notice && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-25 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber-200 dark:border-stone-700 bg-[#fff8e8] dark:bg-stone-900 p-4 text-sm text-[#63391d] dark:text-stone-100 shadow-xl sm:bottom-6"
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
