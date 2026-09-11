"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import { RetroInput, RetroTextarea, RetroSelect } from "./RetroFormKit";
import RetroFileUpload from "./RetroFileUpload";

const STEPS = ["About you", "Your project", "Budget & timeline", "Requirements", "Review"];

const EMPTY = {
  name: "", email: "", company: "", phone: "",
  projectType: "", description: "",
  budget: "", timeline: "", preferredStartDate: "",
  documentUrl: "", documentName: "",
  servicesNeeded: [] as string[], preferredContact: "", notes: "",
};

const SERVICE_OPTIONS = ["Mobile app", "Web app", "Backend / API", "MVP", "Performance work", "Ongoing maintenance"];
const BUDGET_OPTIONS = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,000", "$7,000 – $15,000", "$15,000+", "Not sure yet"];
const TIMELINE_OPTIONS = ["ASAP", "2–4 weeks", "1–2 months", "3–6 months", "Flexible / no rush"];
const CONTACT_OPTIONS = ["Email", "Phone call", "WhatsApp", "Video call"];

type Errors = Partial<Record<keyof typeof EMPTY, string>>;

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</span>
      {children}
      {error && <p style={{ color: "var(--r)", fontSize: 10, fontFamily: "var(--font-retro-body)", marginTop: 6 }}>{error}</p>}
    </label>
  );
}

export default function RetroHirePage({ osName }: { osName: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const [setupLink, setSetupLink] = useState("");
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY, v: string | string[]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleService = (s: string) => {
    setForm((f) => ({
      ...f,
      servicesNeeded: f.servicesNeeded.includes(s) ? f.servicesNeeded.filter((x) => x !== s) : [...f.servicesNeeded, s],
    }));
  };

  const validateStep = (): Errors => {
    const next: Errors = {};
    if (step === 0) {
      if (!form.name.trim()) next.name = "Enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    }
    if (step === 1) {
      if (!form.projectType.trim()) next.projectType = "Tell me what kind of project this is.";
      if (!form.description.trim()) next.description = "Add a short description.";
    }
    return next;
  };

  const goNext = () => {
    const next = validateStep();
    setErrors(next);
    if (Object.keys(next).length === 0) setStep((s) => s + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setRefId(data.referenceId);
      if (data.needsPasswordSetup && data.setupToken) {
        setSetupLink(`/account/setup?token=${encodeURIComponent(data.setupToken)}`);
      }
    } catch {
      setError("Couldn't submit that just now — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (refId) {
    return (
      <RetroPageShell osName={osName}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 140px", textAlign: "center" }}>
          <TerminalWindow title="booking.confirmed">
            <div style={{ padding: "40px 32px" }}>
              <div style={{ width: 52, height: 52, border: "1px solid var(--g)", color: "var(--g)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Check size={24} />
              </div>
              <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: "0 0 10px" }}>
                request received.
              </GlitchText>
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>
                Thanks — I&apos;ll review this and get back to you within a day or two.
              </p>
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--g)", marginBottom: 28 }}>reference: {refId}</p>

              {setupLink && (
                <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 20, textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 18, color: "var(--text)", marginBottom: 10 }}>set up your project dashboard</div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 16 }}>
                    Track messages, milestones, and payments for this project in one place.
                  </p>
                  <a href={setupLink}>
                    <button data-cursor-hover style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 11, letterSpacing: "0.08em" }}>
                      set up dashboard access <ArrowRight size={13} />
                    </button>
                  </a>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      </RetroPageShell>
    );
  }

  return (
    <RetroPageShell osName={osName}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 140px" }}>
        <TerminalWindow title="hire.sh — project brief wizard" hint={`step ${step + 1}/${STEPS.length}`}>
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="HR" label="PROJECT_BRIEF" />
            <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 24px" }}>
              let&apos;s scope your project.
            </GlitchText>

            <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 3, marginBottom: 6, background: i <= step ? "var(--g)" : "var(--border)" }} />
                  <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: i <= step ? "var(--text-dim)" : "var(--border)", display: "block" }} className="hide-sm">
                    {s}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {step === 0 && (
                <>
                  <Field label="your name" error={errors.name}><RetroInput value={form.name} onChange={(e) => set("name", e.target.value)} error={!!errors.name} /></Field>
                  <Field label="email" error={errors.email}><RetroInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={!!errors.email} /></Field>
                  <Field label="company (optional)"><RetroInput value={form.company} onChange={(e) => set("company", e.target.value)} /></Field>
                  <Field label="phone (optional)"><RetroInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="project type" error={errors.projectType}>
                    <RetroInput value={form.projectType} onChange={(e) => set("projectType", e.target.value)} placeholder="e.g. Mobile app, MVP, redesign" error={!!errors.projectType} />
                  </Field>
                  <Field label="describe the project" error={errors.description}>
                    <RetroTextarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} error={!!errors.description} />
                  </Field>
                  <RetroFileUpload folder="booking-documents" onUploaded={(url, filename) => { set("documentUrl", url); set("documentName", filename); }} />
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="budget range">
                    <RetroSelect value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                      <option value="">select a range…</option>
                      {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </RetroSelect>
                  </Field>
                  <Field label="desired timeline">
                    <RetroSelect value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                      <option value="">select a timeline…</option>
                      {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </RetroSelect>
                  </Field>
                  <Field label="preferred start date (optional)">
                    <RetroInput type="date" value={form.preferredStartDate} onChange={(e) => set("preferredStartDate", e.target.value)} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="which services do you need?">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {SERVICE_OPTIONS.map((s) => (
                        <button
                          type="button" key={s} onClick={() => toggleService(s)} data-cursor-hover
                          style={{
                            fontFamily: "var(--font-retro-body)", fontSize: 11, padding: "9px 14px", cursor: "none",
                            color: form.servicesNeeded.includes(s) ? "var(--bg)" : "var(--text)",
                            background: form.servicesNeeded.includes(s) ? "var(--white)" : "var(--bg2)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="preferred contact method">
                    <RetroSelect value={form.preferredContact} onChange={(e) => set("preferredContact", e.target.value)}>
                      <option value="">select…</option>
                      {CONTACT_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </RetroSelect>
                  </Field>
                  <Field label="anything else? (optional)"><RetroTextarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
                </>
              )}

              {step === 4 && (
                <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 20, display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
                  <p><span style={{ color: "var(--text)" }}>name:</span> {form.name}</p>
                  <p><span style={{ color: "var(--text)" }}>email:</span> {form.email}</p>
                  <p><span style={{ color: "var(--text)" }}>project:</span> {form.projectType}</p>
                  <p><span style={{ color: "var(--text)" }}>budget:</span> {form.budget || "—"}</p>
                  <p><span style={{ color: "var(--text)" }}>timeline:</span> {form.timeline || "—"}</p>
                  <p><span style={{ color: "var(--text)" }}>start date:</span> {form.preferredStartDate || "—"}</p>
                  <p><span style={{ color: "var(--text)" }}>document:</span> {form.documentName || "—"}</p>
                  <p><span style={{ color: "var(--text)" }}>services:</span> {form.servicesNeeded.join(", ") || "—"}</p>
                </div>
              )}

              {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)" }}>{error}</p>}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {step > 0 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} data-cursor-hover style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "none", color: "var(--text-dim)", fontFamily: "var(--font-retro-body)", fontSize: 12 }}>
                    <ArrowLeft size={14} /> back
                  </button>
                ) : <span />}

                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={goNext} data-cursor-hover style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 22px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 12, letterSpacing: "0.08em" }}>
                    continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} data-cursor-hover style={{ padding: "11px 22px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", fontFamily: "var(--font-retro-body)", fontSize: 12, letterSpacing: "0.08em", opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? "submitting..." : "submit request"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </TerminalWindow>
      </div>
    </RetroPageShell>
  );
}