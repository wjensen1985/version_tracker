"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-900 hover:text-white dark:border-gray-300 dark:text-gray-200 dark:hover:bg-gray-100 dark:hover:text-gray-900"
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
