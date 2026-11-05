"use client";
import { useEffect, useState } from "react";
export const readingSizes = [
  "text-[20px]",
  "text-[24px]",
  "text-[28px]",
  "text-[32px]",
  "text-[36px]",
];
export default function useReadingSettings() {
  const [size, setSize] = useState(1),
    [dark, setDark] = useState(false),
    [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("kirtan-reading-settings") || "null",
      );
      if (saved) {
        if (
          Number.isInteger(saved.size) &&
          saved.size >= 0 &&
          saved.size < readingSizes.length
        )
          setSize(saved.size);
        setDark(saved.dark === true);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "kirtan-reading-settings",
          JSON.stringify({ size, dark }),
        );
      } catch {}
  }, [size, dark, ready]);
  return { size, setSize, dark, setDark, fontClass: readingSizes[size] };
}
