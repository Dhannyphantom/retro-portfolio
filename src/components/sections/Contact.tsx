"use client";
import { useState, FormEvent } from "react";
import { Github, Linkedin, Mail, ArrowUpRight, MapPin, Clock } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (e: FormEvent) => {
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
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setServerError("Something went wrong sending that — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative max-w-[1120px] mx-auto px-7 pb-[90px]">
      <div className="hover-card relative overflow-hidden rounded-2xl p-8 sm:p-11 grid grid-cols-1 md:grid-cols-2 gap-12" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(135deg, #131116, #08070A)" }}>
        <Reveal from="left">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>CONTACTS</span>
          <h2 className="font-display font-semibold text-[clamp(26px,3.2vw,36px)] mt-2.5 mb-4 tracking-tight">
            Have a project?<br />Let&apos;s talk.
          </h2>
          <p className="text-mute text-[15px] leading-relaxed mb-5 max-w-[380px]">Tell me what you&apos;re building and I&apos;ll get back within a day or two.</p>
          <div className="flex items-center gap-2 text-mute text-[13px] mb-2"><MapPin size={14} /> Remote — open worldwide</div>
          <div className="flex items-center gap-2 text-mute text-[13px] mb-[22px]"><Clock size={14} /> Usually replies within 1–2 days</div>
          <div className="flex gap-3">
            {[Github, Linkedin, Mail].map((Icon, idx) => (
              <a key={idx} href="#" className="icon-hover w-[42px] h-[42px] rounded flex items-center justify-center" style={{ border: "1px solid rgba(243,240,247,0.12)" }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal from="right" delay={80}>
          {sent ? (
            <div className="flex flex-col justify-center h-full items-start">
              <div className="w-[46px] h-[46px] rounded flex items-center justify-center mb-4 text-violet" style={{ background: "rgba(180,92,255,0.068)", border: "1px solid rgba(180,92,255,0.177)" }}>✓</div>
              <h3 className="font-display text-xl mb-2">Message sent</h3>
              <p className="text-mute text-sm mb-[18px]">Thanks — I&apos;ll reply soon.</p>
              <button onClick={() => setSent(false)} className="text-violet text-[13.5px]">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <div>
                <input
                  type="text" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04]"
                  style={{ border: `1px solid ${errors.name ? "#E24B4A" : "rgba(243,240,247,0.12)"}` }}
                />
                {errors.name && <p className="text-[12.5px] mt-1.5" style={{ color: "#E24B4A" }}>{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email" placeholder="you@company.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04]"
                  style={{ border: `1px solid ${errors.email ? "#E24B4A" : "rgba(243,240,247,0.12)"}` }}
                />
                {errors.email && <p className="text-[12.5px] mt-1.5" style={{ color: "#E24B4A" }}>{errors.email}</p>}
              </div>
              <div>
                <textarea
                  placeholder="What are you building?" rows={4} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04] resize-none"
                  style={{ border: `1px solid ${errors.message ? "#E24B4A" : "rgba(243,240,247,0.12)"}` }}
                />
                {errors.message && <p className="text-[12.5px] mt-1.5" style={{ color: "#E24B4A" }}>{errors.message}</p>}
              </div>
              {serverError && <p className="text-[12.5px]" style={{ color: "#E24B4A" }}>{serverError}</p>}
              <CTAButton variant="primary" type="submit" className="w-full">
                {submitting ? "Sending..." : "Submit"} <ArrowUpRight size={16} />
              </CTAButton>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
