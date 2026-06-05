"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Resolve initial theme
    const activeTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark" || "dark";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-lg border border-bg-border bg-bg-card hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer active:scale-95 shadow-sm flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-accent-gold" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-accent-blue" />
      )}
    </button>
  );
}
