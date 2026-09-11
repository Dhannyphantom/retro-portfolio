"use client";
import { useEffect } from "react";

// Every route in the app now has its own retro-terminal chrome (RetroHome,
// RetroPageShell, RetroAdminShell, or the /account & /admin layouts) — there
// is no legacy UI left to gate. This component is kept as a single seam in
// the tree (rather than deleting it and inlining {children} directly in
// layout.tsx) in case a future redesign needs to branch chrome by route again.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("retro-active");
  }, []);

  return <>{children}</>;
}
