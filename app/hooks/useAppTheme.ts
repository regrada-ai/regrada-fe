"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function useAppTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    mounted,
    isDark: mounted && resolvedTheme === "dark",
    isLight: mounted && resolvedTheme === "light",
  };
}
