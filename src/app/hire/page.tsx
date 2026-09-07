"use client";
import { useState, FormEvent } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";
import FileUpload from "@/components/ui/FileUpload";

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

export default function HirePage() {
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

  const submit = async (e: FormEvent) => {
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
      <div className="max-w-[600px] mx-auto px-7 pt-28 pb-32 text-center">
        <Reveal>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-violet" style={{ background: "rgba(0,229,255,0.068)", border: "1px solid rgba(0,229,255,0.204)" }}>
            <Check size={22} />
          </div>
          <h1 className="font-display text-[17px] leading-relaxed mb-3">Request received</h1>
          <p className="text-mute mb-2">Thanks — I&apos;ll review this and get back to you within a day or two.</p>
          <p className="font-mono text-sm text-violet mb-8">Reference: {refId}</p>

          {setupLink && (
            <div className="rounded-xl p-6 text-left" style={{ border: "1px solid rgba(0,229,255,0.204)", background: "rgba(57,255,20,0.05)" }}>
              <h3 className="font-display text-[13px] mb-3 leading-relaxed">Set up your project dashboard</h3>
              <p className="text-mute text-sm mb-4">
                Track messages, milestones, and payments for this project in one place. Set a password to get in.
              </p>
              <a href={setupLink} className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded bg-gradient-to-r from-purple to-purple-2">
                Set up dashboard access <ArrowRight size={14} />
              </a>
            </div>
          )}
        </Reveal>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto px-7 pt-16 pb-28">
      <Reveal>
        <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,229,255,0.422)" }}>PROJECT BRIEF</span>
        <h1 className="font-display text-[clamp(15px,2.2vw,19px)] tracking-tight mt-3 mb-8 leading-relaxed">Let&apos;s scope your project</h1>

        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1 rounded-full mb-2" style={{ background: i <= step ? "linear-gradient(90deg, #00E5FF, #39FF14)" : "rgba(217,214,232,0.1)" }} />
              <span className="text-[11px] text-mute hidden sm:block">{s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <Field label="Your name" error={errors.name}><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass(!!errors.name)} /></Field>
              <Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass(!!errors.email)} /></Field>
              <Field label="Company (optional)"><input value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass(false)} /></Field>
              <Field label="Phone (optional)"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass(false)} /></Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Project type" error={errors.projectType}>
                <input value={form.projectType} onChange={(e) => set("projectType", e.target.value)} placeholder="e.g. Mobile app, MVP, redesign" className={inputClass(!!errors.projectType)} />
              </Field>
              <Field label="Describe the project" error={errors.description}>
                <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass(!!errors.description)} resize-none`} />
              </Field>
              <FileUpload
                folder="booking-documents"
                onUploaded={(url, filename) => { set("documentUrl", url); set("documentName", filename); }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Budget range">
                <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={inputClass(false)}>
                  <option value="">Select a range…</option>
                  {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Desired timeline">
                <select value={form.timeline} onChange={(e) => set("timeline", e.target.value)} className={inputClass(false)}>
                  <option value="">Select a timeline…</option>
                  {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Preferred start date (optional)">
                <input type="date" value={form.preferredStartDate} onChange={(e) => set("preferredStartDate", e.target.value)} className={inputClass(false)} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Which services do you need?">
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((s) => (
                    <button
                      type="button" key={s} onClick={() => toggleService(s)}
                      className="text-[13px] rounded-full px-3.5 py-2"
                      style={{
                        color: form.servicesNeeded.includes(s) ? "#0A0118" : "#D9D6E8",
                        background: form.servicesNeeded.includes(s) ? "#D9D6E8" : "rgba(217,214,232,0.06)",
                        border: "1px solid rgba(217,214,232,0.12)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Preferred contact method">
                <select value={form.preferredContact} onChange={(e) => set("preferredContact", e.target.value)} className={inputClass(false)}>
                  <option value="">Select…</option>
                  {CONTACT_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Anything else? (optional)"><textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputClass(false)} resize-none`} /></Field>
            </>
          )}

          {step === 4 && (
            <div className="text-sm text-mute space-y-2 rounded-xl p-5" style={{ border: "1px solid rgba(217,214,232,0.1)" }}>
              <p><strong className="text-paper">Name:</strong> {form.name}</p>
              <p><strong className="text-paper">Email:</strong> {form.email}</p>
              <p><strong className="text-paper">Project:</strong> {form.projectType}</p>
              <p><strong className="text-paper">Budget:</strong> {form.budget || "—"}</p>
              <p><strong className="text-paper">Timeline:</strong> {form.timeline || "—"}</p>
              <p><strong className="text-paper">Start date:</strong> {form.preferredStartDate || "—"}</p>
              <p><strong className="text-paper">Document:</strong> {form.documentName || "—"}</p>
              <p><strong className="text-paper">Services:</strong> {form.servicesNeeded.join(", ") || "—"}</p>
            </div>
          )}

          {error && <p className="text-[12.5px]" style={{ color: "#FF3B3B" }}>{error}</p>}

          <div className="flex justify-between mt-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1.5 text-sm text-mute">
                <ArrowLeft size={15} /> Back
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <CTAButton variant="primary" onClick={goNext}>
                Continue <ArrowRight size={15} />
              </CTAButton>
            ) : (
              <CTAButton variant="primary" type="submit">
                {submitting ? "Submitting..." : "Submit request"}
              </CTAButton>
            )}
          </div>
        </form>
      </Reveal>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04] border ${hasError ? "" : "border-white/[0.12]"}`;

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="block text-[13px] text-mute mb-1.5">{label}</span>
      <div style={error ? { borderRadius: 4, boxShadow: "0 0 0 1px #FF3B3B" } : undefined}>{children}</div>
      {error && <p className="text-[12px] mt-1.5" style={{ color: "#FF3B3B" }}>{error}</p>}
    </label>
  );
}
