"use client";
import { useEffect, useState } from "react";
import useSiteTheme from "./useSiteTheme";
export const readingSizes = [
  "text-[20px]",
  "text-[24px]",
  "text-[28px]",
  "text-[32px]",
  "text-[36px]",
];
export default function useReadingSettings() {
  const [size, setSize] = useState(1),
    [ready, setReady] = useState(false);
  const theme = useSiteTheme();
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("kirtan-reading-settings") || "null",
      );
      if (
        Number.isInteger(saved?.size) &&
        saved.size >= 0 &&
        saved.size < readingSizes.length
      )
        setSize(saved.size);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "kirtan-reading-settings",
          JSON.stringify({ size }),
        );
      } catch {}
  }, [size, ready]);
  return { size, setSize, ...theme, fontClass: readingSizes[size] };
}
