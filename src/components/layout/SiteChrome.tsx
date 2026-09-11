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

    // Browsers restore the previous scroll position on refresh / bfcache
    // navigation by default. Combined with content on the homepage that
    // grows in height right after mount (the boot-sequence typewriter), that
    // restored offset can land the viewport well past the hero — it looks
    // like the page "auto-scrolled away" before the boot text is ever seen.
    // Taking manual control of scroll restoration and forcing the viewport
    // to the top on first mount fixes that for every route.
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <>{children}</>;
}
