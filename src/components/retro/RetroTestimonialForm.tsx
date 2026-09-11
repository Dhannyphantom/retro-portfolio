"use client";
import { useState } from "react";
import { Star, Check } from "lucide-react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import { RetroInput, RetroTextarea, RetroSubmit } from "./RetroFormKit";

const EMPTY = { clientName: "", position: "", company: "", quote: "", project: "" };

export default function RetroTestimonialForm({ osName }: { osName: string }) {
  const [form, setForm] = useState(EMPTY);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.quote.trim()) {
      setError("Name and your review are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setError("Couldn't submit that just now — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="review.new" hint="share your experience">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="TS" label="LEAVE_A_REVIEW" />
            {sent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 48, height: 48, border: "1px solid var(--g)", color: "var(--g)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check size={22} />
                </div>
                <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 28, color: "var(--text)", margin: "0 0 8px" }}>thank you.</GlitchText>
                <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
                  Your review has been submitted and will appear on the site once reviewed.
                </p>
              </div>
            ) : (
              <>
                <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 8px" }}>
                  leave a review.
                </GlitchText>
                <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
                  Worked with me on something? I&apos;d love to hear how it went.
                </p>
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <RetroInput placeholder="your name" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <RetroInput placeholder="position (optional)" value={form.position} onChange={(e) => set("position", e.target.value)} />
                    <RetroInput placeholder="company (optional)" value={form.company} onChange={(e) => set("company", e.target.value)} />
                  </div>
                  <RetroInput placeholder="related project (optional)" value={form.project} onChange={(e) => set("project", e.target.value)} />
                  <div>
                    <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>rating</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button type="button" key={n} onClick={() => setRating(n)} data-cursor-hover style={{ background: "none", border: "none", cursor: "none", padding: 0 }}>
                          <Star size={22} color={n <= rating ? "var(--g)" : "var(--border)"} fill={n <= rating ? "var(--g)" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <RetroTextarea placeholder="your review" rows={5} value={form.quote} onChange={(e) => set("quote", e.target.value)} />
                  {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)" }}>{error}</p>}
                  <RetroSubmit type="submit" disabled={submitting}>{submitting ? "submitting..." : "submit review →"}</RetroSubmit>
                </form>
              </>
            )}
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}
