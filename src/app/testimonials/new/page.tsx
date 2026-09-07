"use client";
import { useState, FormEvent } from "react";
import { Star, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";

const EMPTY = { clientName: "", position: "", company: "", quote: "", project: "" };

export default function NewTestimonialPage() {
  const [form, setForm] = useState(EMPTY);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
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

  if (sent) {
    return (
      <div className="max-w-[560px] mx-auto px-7 pt-28 pb-32 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-violet" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)" }}>
          <Check size={22} />
        </div>
        <h1 className="font-display text-[17px] leading-relaxed mb-3">Thank you</h1>
        <p className="text-mute">Your review has been submitted and will appear on the site once reviewed.</p>
      </div>
    );
  }

  const input = "w-full rounded px-3.5 py-3 text-[14.5px] outline-none bg-white/[0.04] border border-white/[0.12]";

  return (
    <div className="max-w-[560px] mx-auto px-7 pt-16 pb-28">
      <Reveal>
        <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,229,255,0.42)" }}>SHARE YOUR EXPERIENCE</span>
        <h1 className="font-display text-[clamp(15px,2.2vw,19px)] tracking-tight mt-3 mb-3 leading-relaxed">Leave a review</h1>
        <p className="text-mute text-sm mb-8">Worked with me on something? I&apos;d love to hear how it went.</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="block">
            <span className="block text-[13px] text-mute mb-1.5">Your name</span>
            <input className={input} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-[13px] text-mute mb-1.5">Position (optional)</span>
              <input className={input} value={form.position} onChange={(e) => set("position", e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-[13px] text-mute mb-1.5">Company (optional)</span>
              <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} />
            </label>
          </div>
          <label className="block">
            <span className="block text-[13px] text-mute mb-1.5">Related project (optional)</span>
            <input className={input} value={form.project} onChange={(e) => set("project", e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-[13px] text-mute mb-1.5">Rating</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star size={22} className={n <= rating ? "text-violet fill-violet" : "text-mute"} />
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="block text-[13px] text-mute mb-1.5">Your review</span>
            <textarea rows={5} className={`${input} resize-none`} value={form.quote} onChange={(e) => set("quote", e.target.value)} />
          </label>
          {error && <p className="text-[12.5px]" style={{ color: "#FF3B3B" }}>{error}</p>}
          <CTAButton variant="primary" type="submit" className="w-full">{submitting ? "Submitting..." : "Submit review"}</CTAButton>
        </form>
      </Reveal>
    </div>
  );
}
