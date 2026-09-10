"use client";
import { ThemeProvider } from "@/lib/theme";
import { AchievementsProvider } from "@/lib/achievements";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AchievementsProvider>{children}</AchievementsProvider>
    </ThemeProvider>
  );
}
