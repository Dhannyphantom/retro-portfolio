"use client";
import RetroPageShell, { BackLink } from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SafeImage from "@/components/ui/SafeImage";
import ThreadPanel from "@/components/account/ThreadPanel";
import ProjectReview from "@/components/account/ProjectReview";
import { formatMoney } from "@/lib/currency";

export default function RetroProjectDashboard({ osName, booking }: { osName: string; booking: any }) {
  const b = booking;
  const outstanding = Math.max((b.totalBudget || 0) - (b.amountPaid || 0), 0);
  const progressPct = b.totalBudget ? Math.min(Math.round(((b.amountPaid || 0) / b.totalBudget) * 100), 100) : 0;

  const statBox = (label: string, value: React.ReactNode) => (
    <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "16px 18px" }}>
      <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 24, color: "var(--text)" }}>{value}</div>
    </div>
  );

  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 140px" }}>
        <BackLink href="/account/dashboard">all projects</BackLink>

        <TerminalWindow title={`${b.referenceId}.project`} hint={b.status}>
          <div style={{ padding: "32px 36px" }}>
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 24px" }}>
              {b.projectType || "Project"}
            </GlitchText>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
              {statBox("total budget", b.totalBudget ? formatMoney(b.totalBudget, b.currency) : "not yet agreed")}
              {statBox("paid so far", formatMoney(b.amountPaid || 0, b.currency))}
              {statBox("outstanding", formatMoney(outstanding, b.currency))}
            </div>

            {b.totalBudget > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ height: 6, background: "var(--bg3)", border: "1px solid var(--border)" }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--g)" }} />
                </div>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginTop: 6 }}>{progressPct}% paid</div>
              </div>
            )}

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 14 }}>· TIMELINE_&_MILESTONES</div>
              {b.approvedTimeline && (
                <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 12 }}>
                  agreed timeline: <span style={{ color: "var(--text)" }}>{b.approvedTimeline}</span>
                </p>
              )}
              {!b.milestones?.length ? (
                <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
                  No milestones set yet — these appear once a proposal is approved in the conversation below.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {b.milestones.map((m: any, i: number) => (
                    <div key={i} style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                        <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 18, color: "var(--text)" }}>{m.title}</div>
                        <span
                          style={{
                            fontFamily: "var(--font-retro-body)", fontSize: 10, padding: "2px 8px", flexShrink: 0,
                            color: m.status === "completed" ? "var(--g)" : m.status === "in-progress" ? "var(--c)" : "var(--text-dim)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {m.status}
                        </span>
                      </div>
                      {m.description && <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 6 }}>{m.description}</p>}
                      {m.dueDate && <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>due {m.dueDate}</p>}
                      {!!m.media?.length && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                          {m.media.map((url: string, mi: number) => (
                            <SafeImage key={mi} src={url} className="w-20 h-20 object-cover" iconSize={18} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ProjectReview bookingId={b._id} />

            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>
              Use the chat icon on the right to discuss scope, budget and timeline — when we agree on terms, I&apos;ll send a proposal you can approve, which updates everything above automatically.
            </p>
          </div>
        </TerminalWindow>
      </div>
      <ThreadPanel bookingId={b._id} viewerRole="client" />
    </RetroPageShell>
  );
}
