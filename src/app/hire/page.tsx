"use client";
import { useState, FormEvent } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";

const STEPS = ["About you", "Your project", "Budget & timeline", "Requirements", "Review"];

const EMPTY = {
  name: "", email: "", company: "", phone: "",
  projectType: "", description: "",
  budget: "", timeline: "",
  servicesNeeded: [] as string[], preferredContact: "", preferredStartDate: "", notes: "",
};

const SERVICE_OPTIONS = ["Mobile app", "Web app", "Backend / API", "MVP", "Performance work", "Ongoing maintenance"];

export default function HirePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (s: string) => {
    setForm((f) => ({
      ...f,
      servicesNeeded: f.servicesNeeded.includes(s) ? f.servicesNeeded.filter((x) => x !== s) : [...f.servicesNeeded, s],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (step === 1) return form.projectType.trim() && form.description.trim();
    return true;
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
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-violet" style={{ background: "rgba(180,92,255,0.068)", border: "1px solid rgba(180,92,255,0.204)" }}>
            <Check size={22} />
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Request received</h1>
          <p className="text-mute mb-2">Thanks — I&apos;ll review this and get back to you within a day or two.</p>
          <p className="font-mono text-sm text-violet">Reference: {refId}</p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto px-7 pt-16 pb-28">
      <Reveal>
        <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>PROJECT BRIEF</span>
        <h1 className="font-display font-bold text-[clamp(28px,4vw,40px)] tracking-tight mt-2 mb-8">Let&apos;s scope your project</h1>

        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1 rounded-full mb-2" style={{ background: i <= step ? "linear-gradient(90deg, #B45CFF, #8B2FE0)" : "rgba(243,240,247,0.1)" }} />
              <span className="text-[11px] text-mute hidden sm:block">{s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <Field label="Your name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
              <Field label="Company (optional)"><input value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass} /></Field>
              <Field label="Phone (optional)"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Project type"><input value={form.projectType} onChange={(e) => set("projectType", e.target.value)} placeholder="e.g. Mobile app, MVP, redesign" className={inputClass} /></Field>
              <Field label="Describe the project"><textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass} resize-none`} /></Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Budget range"><input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="e.g. $1,000 – $3,000" className={inputClass} /></Field>
              <Field label="Desired timeline"><input value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="e.g. 4–6 weeks" className={inputClass} /></Field>
              <Field label="Preferred start date (optional)"><input value={form.preferredStartDate} onChange={(e) => set("preferredStartDate", e.target.value)} className={inputClass} /></Field>
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
                        color: form.servicesNeeded.includes(s) ? "#07050B" : "#F3F0F7",
                        background: form.servicesNeeded.includes(s) ? "#F3F0F7" : "rgba(243,240,247,0.06)",
                        border: "1px solid rgba(243,240,247,0.12)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Preferred contact method"><input value={form.preferredContact} onChange={(e) => set("preferredContact", e.target.value)} placeholder="Email, call, WhatsApp..." className={inputClass} /></Field>
              <Field label="Anything else? (optional)"><textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputClass} resize-none`} /></Field>
            </>
          )}

          {step === 4 && (
            <div className="text-sm text-mute space-y-2 rounded-xl p-5" style={{ border: "1px solid rgba(243,240,247,0.1)" }}>
              <p><strong className="text-paper">Name:</strong> {form.name}</p>
              <p><strong className="text-paper">Email:</strong> {form.email}</p>
              <p><strong className="text-paper">Project:</strong> {form.projectType}</p>
              <p><strong className="text-paper">Budget:</strong> {form.budget || "—"}</p>
              <p><strong className="text-paper">Timeline:</strong> {form.timeline || "—"}</p>
              <p><strong className="text-paper">Services:</strong> {form.servicesNeeded.join(", ") || "—"}</p>
            </div>
          )}

          {error && <p className="text-[12.5px]" style={{ color: "#E24B4A" }}>{error}</p>}

          <div className="flex justify-between mt-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1.5 text-sm text-mute">
                <ArrowLeft size={15} /> Back
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <CTAButton variant="primary" onClick={() => canNext() && setStep((s) => s + 1)}>
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

const inputClass = "w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04] border border-white/[0.12]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] text-mute mb-1.5">{label}</span>
      {children}
    </label>
  );
}
