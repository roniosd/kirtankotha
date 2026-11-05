"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
export default function useSiteTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  const setDark = (value) =>
    setTheme(
      (typeof value === "function" ? value(dark) : value) ? "dark" : "light",
    );
  return { dark, setDark };
}
