"use client";
import { useEffect, useRef, useState } from "react";
import {
  Music2,
  Search,
  Plus,
  ArrowUpRight,
  BookOpen,
  X,
  LogOut,
  Flame,
  Flower2,
  Heart,
  ChevronDown,
} from "lucide-react";
import { categories, demoSongs } from "@/lib/songs";
const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export default function Home() {
  const [songs, setSongs] = useState(demoSongs),
    [user, setUser] = useState(null),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("সব গান"),
    [type, setType] = useState("সব"),
    [modal, setModal] = useState(null),
    [active, setActive] = useState(null),
    [signup, setSignup] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const dialog = useRef(null);
  const [favorites, setFavorites] = useState([]),
    [onlyFavorites, setOnlyFavorites] = useState(false),
    [favoriteBusy, setFavoriteBusy] = useState(false),
    [favoritesReady, setFavoritesReady] = useState(demo);
  useEffect(() => {
    let cancelled = false;
    if (demo) {
      try {
        const saved = JSON.parse(
          localStorage.getItem("kirtan-demo-favorites") || "[]",
        );
        if (Array.isArray(saved))
          setFavorites(saved.filter((id) => typeof id === "string"));
      } catch {}
      return;
    }
    setFavorites([]);
    setFavoritesReady(false);
    if (!user) return;
    fetch("/api/favorites")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        if (!cancelled) {
          setFavorites(d.favorites);
          setFavoritesReady(true);
        }
      })
      .catch((err) => {
        if (!cancelled) setNotice(err.message || "প্রিয় গান লোড করা যায়নি।");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);
  async function toggleFavorite(songId) {
    if (!demo && !user) {
      open("auth");
      return;
    }
    if (favoriteBusy || (!demo && !favoritesReady)) return;
    const favorite = !favorites.includes(songId);
    if (demo) {
      const next = favorite
        ? [...favorites, songId]
        : favorites.filter((id) => id !== songId);
      setFavorites(next);
      localStorage.setItem("kirtan-demo-favorites", JSON.stringify(next));
      setNotice("ডেমো: প্রিয় গান শুধু এই ব্রাউজারে সংরক্ষিত হচ্ছে।");
      return;
    }
    setFavoriteBusy(true);
    try {
      const r = await fetch("/api/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId, favorite }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setFavorites(d.favorites);
    } catch (err) {
      setNotice(err.message || "আবার চেষ্টা করুন।");
    } finally {
      setFavoriteBusy(false);
    }
  }
  useEffect(() => {
    if (!demo) {
      fetch("/api/songs")
        .then((r) => r.json())
        .then((d) => {
          if (d.songs) setSongs(d.songs);
          if (d.error) setNotice(d.error);
        })
        .catch(() => setNotice("সংযোগ পাওয়া যায়নি। নমুনা গান দেখানো হচ্ছে।"));
      fetch("/api/auth")
        .then((r) => r.json())
        .then((d) => setUser(d.user || null))
        .catch(() => {});
    }
  }, []);
  useEffect(() => {
    if (modal) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);
  function open(value) {
    setError("");
    setModal(value);
  }
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (demo) {
        setError(
          "এটি ডিজাইন প্রিভিউ। অ্যাকাউন্ট ও গান জমা দিতে ডাউনলোড করা প্রজেক্টে MongoDB সংযুক্ত করুন।",
        );
        return;
      }
      const r = await fetch(modal === "upload" ? "/api/songs" : "/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, action: signup ? "signup" : "signin" }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "আবার চেষ্টা করুন।");
      if (modal === "upload") {
        setSongs((s) => [d.song, ...s]);
        setNotice("আপনার গানটি যোগ হয়েছে। ধন্যবাদ!");
      } else setUser(d.user);
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      const r = await fetch("/api/auth", { method: "DELETE" });
      if (!r.ok) throw Error();
      setUser(null);
      setFavorites([]);
      setOnlyFavorites(false);
    } catch {
      setNotice("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }
  const filtered = songs.filter(
    (s) =>
      (!onlyFavorites || favorites.includes(s._id)) &&
      (category === "সব গান" || s.category === category) &&
      (type === "সব" || s.type === type) &&
      `${s.title} ${s.lyrics} ${s.category}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase().trim()),
  );
  return (
    <>
      <div className="devotional-band">
        <span>কীর্তন · ভজন · পদাবলী</span>
        <span>ভক্তির সুরে, হৃদয়ের সংযোগ</span>
      </div>
      <header>
        <a className="brand" href="/" aria-label="কীর্তনকথা হোম">
          <span className="brand-icon" aria-hidden="true">
            ওঁ
          </span>
          কীর্তন<span>কথা</span>
        </a>
        <nav>
          <a href="#collection">গানের সংগ্রহ</a>
          {user ? (
            <button className="quiet" onClick={logout}>
              <LogOut size={16} />
              লগআউট
            </button>
          ) : (
            <button className="quiet" onClick={() => open("auth")}>
              লগইন / নিবন্ধন
            </button>
          )}
          <button
            className="primary"
            onClick={() => open(user ? "upload" : "auth")}
          >
            <Plus size={17} /> গান যোগ করুন
          </button>
        </nav>
      </header>
      <main>
        <section className="hero">
          <img
            className="hero-image"
            src="/images/devotional-temple.webp"
            alt="পদ্মফুল, প্রদীপ ও ভোরের আলোয় বাংলার মন্দিরের চিত্র"
          />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="eyebrow">
              <Flower2 size={16} /> সনাতন ভক্তিগীতির উন্মুক্ত খাতা
            </div>
            <h1>
              ভক্তির সুরে,
              <br />
              <em>শান্তি খুঁজে নিন।</em>
            </h1>
            <p>
              কীর্তন, পদাবলী আর প্রার্থনার প্রতিটি শব্দে
              <br />
              মিশে থাকুক ভক্তি, ভালোবাসা ও হৃদয়ের নিবেদন।
            </p>
            <a className="primary explore" href="#collection">
              গানের খাতা খুলুন <ArrowUpRight size={19} />
            </a>
            <div className="hero-caption">
              <span /> সুরে সুরে স্মরণ, কথায় কথায় ভক্তি
            </div>
          </div>
          <div className="hero-foot">
            <span>
              <BookOpen size={16} /> পড়ুন নিজের ছন্দে
            </span>
            <span>
              <Flame size={15} /> বাংলার ভক্তি, বাংলার গান
            </span>
          </div>
        </section>
        <div className="sacred-divider" aria-hidden="true">
          <span />
          <Flower2 size={21} />
          <span />
        </div>
        <section className="collection" id="collection">
          <div className="section-top">
            <div>
              <span className="eyebrow">ভক্তির কথামালা</span>
              <h2>
                গানের সংগ্রহ<span>এক খাতায়, অনেক সুর</span>
              </h2>
            </div>
            <label className="search">
              <Search size={20} />
              <input
                aria-label="গান খুঁজুন"
                placeholder="গানের নাম বা কথা লিখে খুঁজুন…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="সার্চ মুছুন" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </label>
          </div>
          <div className="filters" aria-label="গানের ক্যাটাগরি">
            {["সব গান", ...categories].map((c) => (
              <button
                className={category === c ? "selected" : ""}
                key={c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="results-bar">
            <div className="library-tabs">
              <button
                className={!onlyFavorites ? "active" : ""}
                aria-pressed={!onlyFavorites}
                onClick={() => setOnlyFavorites(false)}
              >
                সব গান
              </button>
              <button
                className={onlyFavorites ? "active" : ""}
                aria-pressed={onlyFavorites}
                onClick={() => {
                  if (!demo && !user) {
                    open("auth");
                    return;
                  }
                  setOnlyFavorites(true);
                }}
              >
                <Heart size={14} /> প্রিয় গান (
                {favorites.length.toLocaleString("bn-BD")})
              </button>
            </div>
            <span>
              {filtered.length.toLocaleString("bn-BD")}টি গান পাওয়া গেছে
            </span>
            <label>
              ধরন{" "}
              <select
                aria-label="গানের ধরন"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {["সব", "কীর্তন", "গান"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
          {notice && (
            <div role="status" className="notice">
              {notice}
              <button aria-label="বন্ধ করুন" onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}
          <div className="grid">
            {filtered.map((s, i) => (
              <article key={s._id} className="song">
                <button
                  className="song-open"
                  onClick={() => {
                    setActive(s);
                    open("read");
                  }}
                  aria-label={`${s.title} পড়ুন`}
                >
                  <div className="card-top">
                    <span
                      className={
                        "badge tone" + (categories.indexOf(s.category) % 3)
                      }
                    >
                      {s.category}
                    </span>
                    <span className="index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.lyrics.split("\n").slice(0, 2).join("\n")}</p>
                </button>
                <div className="card-bottom">
                  <span>
                    <Music2 size={14} />
                    {s.author || "কমিউনিটি"} · {s.type}
                  </span>
                  <button
                    className={
                      "favorite " + (favorites.includes(s._id) ? "saved" : "")
                    }
                    aria-label={`${s.title} ${favorites.includes(s._id) ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় তালিকায় রাখুন"}`}
                    aria-pressed={favorites.includes(s._id)}
                    disabled={
                      favoriteBusy || (!demo && !!user && !favoritesReady)
                    }
                    onClick={() => toggleFavorite(s._id)}
                  >
                    <Heart
                      size={18}
                      fill={favorites.includes(s._id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">
              <Search />
              <h3>কোনো গান পাওয়া যায়নি</h3>
              <p>
                {onlyFavorites
                  ? "গানের পাশের হৃদয় চিহ্নে চাপ দিয়ে প্রিয় তালিকায় যোগ করুন।"
                  : "অন্য শব্দ বা ক্যাটাগরি দিয়ে খুঁজে দেখুন।"}
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("সব গান");
                  setType("সব");
                  setOnlyFavorites(false);
                }}
              >
                সব গান দেখুন
              </button>
            </div>
          )}
          <aside className="contribute">
            <div className="contribute-icon">
              <Flower2 />
            </div>
            <div>
              <h3>আপনার জানা গানটি এখানে নেই?</h3>
              <p>একটি গান যোগ করুন, সমৃদ্ধ হোক আমাদের সবার গানের খাতা।</p>
            </div>
            <button onClick={() => open(user ? "upload" : "auth")}>
              গান যোগ করুন <Plus size={17} />
            </button>
          </aside>
        </section>
      </main>
      <footer>
        <a className="brand" href="/">
          কীর্তন<span>কথা</span>
        </a>
        <span>ভক্তির গান বেঁচে থাকুক, প্রজন্ম থেকে প্রজন্মে।</span>
        <small>
          {demo
            ? "ডিজাইন প্রিভিউ · নমুনা গানের সংগ্রহ"
            : "সবার জন্য উন্মুক্ত গানের খাতা"}
        </small>
      </footer>
      <dialog
        ref={dialog}
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
      >
        <button
          className="close"
          aria-label="বন্ধ করুন"
          onClick={() => setModal(null)}
        >
          <X />
        </button>
        {modal === "read" && active ? (
          <article className="reader">
            <span className="badge">
              {active.category} · {active.type}
            </span>
            <h2>{active.title}</h2>
            <p className="muted">{active.author || "কমিউনিটি"}</p>
            <div className="lyrics">{active.lyrics}</div>
          </article>
        ) : (
          <>
            <div className="modal-icon">
              <Flower2 />
            </div>
            <h2>
              {modal === "upload"
                ? "গানের খাতায় যোগ করুন"
                : signup
                  ? "আপনাকে স্বাগতম"
                  : "আবার দেখা হলো!"}
            </h2>
            <p className="muted">
              {modal === "upload"
                ? "আপনার জানা গানের কথা সবার সঙ্গে ভাগ করে নিন।"
                : "গান যোগ করতে আপনার অ্যাকাউন্টে প্রবেশ করুন।"}
            </p>
            <form onSubmit={submit}>
              {modal === "upload" ? (
                <>
                  <label>
                    গানের শিরোনাম
                    <input
                      name="title"
                      required
                      minLength={2}
                      maxLength={120}
                      placeholder="গানের নাম লিখুন"
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      ক্যাটাগরি
                      <select name="category">
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      ধরন
                      <select name="type">
                        <option>কীর্তন</option>
                        <option>গান</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    গানের কথা
                    <textarea
                      name="lyrics"
                      required
                      minLength={10}
                      maxLength={20000}
                      rows={8}
                      placeholder="এখানে সম্পূর্ণ গানের কথা লিখুন…"
                    />
                  </label>
                </>
              ) : (
                <>
                  {signup && (
                    <label>
                      আপনার নাম <small>(ঐচ্ছিক)</small>
                      <input
                        name="name"
                        maxLength={60}
                        autoComplete="name"
                        placeholder="নাম লিখুন"
                      />
                    </label>
                  )}
                  <label>
                    ইমেইল
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label>
                    পাসওয়ার্ড
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      maxLength={72}
                      autoComplete={
                        signup ? "new-password" : "current-password"
                      }
                      placeholder="কমপক্ষে ৮ অক্ষর"
                    />
                  </label>
                </>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary submit" disabled={busy}>
                {busy
                  ? "অপেক্ষা করুন…"
                  : modal === "upload"
                    ? "গান জমা দিন"
                    : signup
                      ? "অ্যাকাউন্ট তৈরি করুন"
                      : "লগইন করুন"}
                <ArrowUpRight size={18} />
              </button>
            </form>
            {modal === "auth" && (
              <p className="switch">
                {signup ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
                <button
                  onClick={() => {
                    setSignup(!signup);
                    setError("");
                  }}
                >
                  {signup ? "লগইন করুন" : "নিবন্ধন করুন"}
                </button>
              </p>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
