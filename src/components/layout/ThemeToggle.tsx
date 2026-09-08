"use client";
import { useTheme } from "@/lib/theme";
import { useAchievements } from "@/lib/achievements";
import { useRef } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { unlock } = useAchievements();
  const switched = useRef(false);

  const handleClick = () => {
    toggleTheme();
    if (!switched.current) {
      switched.current = true;
      unlock("theme_shift");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle light/dark mode"
      data-cursor-hover
      className="theme-switch"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-switch-knob">{theme === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}
