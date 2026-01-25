"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function useAppTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
