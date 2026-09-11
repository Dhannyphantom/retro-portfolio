"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";

type BookingRow = { _id: string; projectType?: string; referenceId: string; status: string };

export default function RetroAccountDashboard({
  osName,
  userName,
  bookings,
}: {
  osName: string;
  userName?: string;
  bookings: BookingRow[];
}) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/account/login");
    router.refresh();
  };

  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="~/account — dashboard.sh" hint={`${bookings.length} project${bookings.length === 1 ? "" : "s"}`}>
          <div style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
              <div>
                <SectionLabel n="AC" label="YOUR_PROJECTS" />
                <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: 0 }}>
                  welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
                </GlitchText>
              </div>
              <button onClick={logout} data-cursor-hover style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1px solid var(--border)", cursor: "none", color: "var(--text-dim)", fontFamily: "var(--font-retro-body)", fontSize: 11, padding: "8px 14px" }}>
                <LogOut size={13} /> log out
              </button>
            </div>

            {bookings.length === 0 ? (
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
                No projects yet. <Link href="/hire" style={{ color: "var(--g)" }} data-cursor-hover>Submit a project brief</Link> to get started.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {bookings.map((b) => (
                  <Link key={b._id} href={`/account/projects/${b._id}`} data-cursor-hover>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border)", background: "var(--card-bg)", padding: "16px 20px" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)" }}>{b.projectType || "Project"}</div>
                        <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>ref {b.referenceId} · {b.status}</div>
                      </div>
                      <ArrowRight size={16} color="var(--text-dim)" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
