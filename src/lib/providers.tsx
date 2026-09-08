"use client";
import { ThemeProvider } from "@/lib/theme";
import { AchievementsProvider } from "@/lib/achievements";
import ClickEffects from "@/components/layout/ClickEffects";
import EasterEggs from "@/components/layout/EasterEggs";
import AchievementToastHost from "@/components/layout/AchievementToast";
import GamesPanel from "@/components/games/GamesPanel";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AchievementsProvider>
        {children}
        <ClickEffects />
        <EasterEggs />
        <AchievementToastHost />
        <GamesPanel />
      </AchievementsProvider>
    </ThemeProvider>
  );
}
