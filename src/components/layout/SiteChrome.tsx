"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import MatrixRain from "@/components/layout/MatrixRain";
import BootScreen from "@/components/layout/BootScreen";
import ClickEffects from "@/components/layout/ClickEffects";
import EasterEggs from "@/components/layout/EasterEggs";
import AchievementToastHost from "@/components/layout/AchievementToast";
import GamesPanel from "@/components/games/GamesPanel";

// The homepage ("/") has been fully rewritten with its own retro-terminal
// chrome (cursor, background rain, top/bottom bars, footer strip — see
// RetroHome.tsx) and renders none of the legacy site chrome below. Every
// other route is still on the legacy UI until its own migration phase, so
// it keeps the original nav/footer/cursor/boot-screen/easter-eggs exactly
// as before. As pages get migrated, add them to `isMigrated` below.
export default function SiteChrome({
  name,
  bio,
  email,
  socials,
  children,
}: {
  name: string;
  bio: string;
  email?: string;
  socials?: { github?: string; linkedin?: string; twitter?: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMigrated = pathname === "/";

  useEffect(() => {
    document.body.classList.toggle("retro-active", isMigrated);
  }, [isMigrated]);

  if (isMigrated) {
    // RetroHome renders its own full-bleed chrome — nothing else needed here.
    return <>{children}</>;
  }

  return (
    <>
      <BootScreen name={name} />
      <MatrixRain />
      <CustomCursor />
      <Nav name={name} />
      <main className="relative z-10">{children}</main>
      <Footer name={name} bio={bio} email={email} socials={socials} />
      <ClickEffects />
      <EasterEggs />
      <AchievementToastHost />
      <GamesPanel />
    </>
  );
}
