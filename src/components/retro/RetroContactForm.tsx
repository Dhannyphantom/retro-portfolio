"use client";
import { useState } from "react";
import { RetroInput, RetroTextarea, RetroSubmit } from "./RetroFormKit";

export default function RetroContactForm({ onSent }: { onSent?: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.message.trim()) next.message = "Tell me a bit about the project.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      onSent?.();
    } catch {
      setServerError("Something went wrong sending that — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 24, fontFamily: "var(--font-retro-body)" }}>
        <div style={{ color: "var(--g)", fontSize: 12, marginBottom: 8 }}>✓ message sent</div>
        <p style={{ color: "var(--text-dim)", fontSize: 12, marginBottom: 16 }}>Thanks — I&apos;ll reply within a day or two.</p>
        <button onClick={() => setSent(false)} style={{ color: "var(--r)", fontSize: 11, background: "none", border: "none", cursor: "none" }} data-cursor-hover>
          send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
      <div>
        <RetroInput placeholder="your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!errors.name} />
        {errors.name && <p style={{ color: "var(--r)", fontSize: 10, marginTop: 4 }}>{errors.name}</p>}
      </div>
      <div>
        <RetroInput placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={!!errors.email} />
        {errors.email && <p style={{ color: "var(--r)", fontSize: 10, marginTop: 4 }}>{errors.email}</p>}
      </div>
      <div>
        <RetroTextarea placeholder="what are you building?" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={!!errors.message} />
        {errors.message && <p style={{ color: "var(--r)", fontSize: 10, marginTop: 4 }}>{errors.message}</p>}
      </div>
      {serverError && <p style={{ color: "var(--r)", fontSize: 11 }}>{serverError}</p>}
      <RetroSubmit type="submit" disabled={submitting}>{submitting ? "sending..." : "submit →"}</RetroSubmit>
    </form>
  );
}
