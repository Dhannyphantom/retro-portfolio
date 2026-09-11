"use client";
import RetroCursor from "./RetroCursor";
import RetroMatrixRain from "./RetroMatrixRain";
import { useTheme } from "@/lib/theme";

export default function RetroAdminShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className="retro-root" style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", position: "relative" }}>
      <RetroCursor />
      <RetroMatrixRain light={theme === "light"} />
      <div className="retro-noise-overlay" />
      {children}
    </div>
  );
}
