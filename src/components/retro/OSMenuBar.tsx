"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function OSMenuBar({ osName }: { osName: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // The red ■ + OS name act as a "back" control: go back one step in the
  // browser history when there is one, otherwise fall back to the homepage
  // (unless we're already there, in which case there's nowhere to go).
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <div className="retro-menubar">
      <button
        type="button"
        onClick={goBack}
        data-cursor-hover
        title="go back"
        aria-label="Go back"
        style={{ display: "inline-flex", alignItems: "center", gap: 20, background: "none", border: "none", padding: 0, cursor: "none" }}
      >
        <span style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 8, color: "var(--r)" }}>■</span>
        <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)" }}>{osName}</span>
      </button>
      <Link href="/account/login" style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }} data-cursor-hover>
        Client
      </Link>
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>View</span>
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>Help</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }} suppressHydrationWarning>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}
