"use client";
import { useEffect, useState, FormEvent } from "react";
import { Star, Check } from "lucide-react";

type Testimonial = { quote: string; rating: number; approved: boolean };

export default function ProjectReview({ bookingId }: { bookingId: string }) {
  const [existing, setExisting] = useState<Testimonial | null | undefined>(undefined);
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/account/projects/${bookingId}/review`)
      .then((r) => r.json())
      .then((d) => setExisting(d.testimonial || null));
  }, [bookingId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) {
      setError("Add a few words about the project.");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/account/projects/${bookingId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, rating }),
    });
    const d = await res.json();
    if (!res.ok) {
      setError(d.error || "Couldn't submit that.");
      setSubmitting(false);
      return;
    }
    setExisting(d.testimonial);
    setSubmitting(false);
  };

  if (existing === undefined) return null;

  return (
    <div className="rounded-xl p-5 mb-10" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
      <h2 className="font-display font-semibold text-lg mb-1">Review & rating</h2>
      {existing ? (
        <>
          <p className="text-mute text-[13px] mb-3">
            {existing.approved ? "Thanks — your review is live on the site." : "Thanks — your review is awaiting approval before it appears on the site."}
          </p>
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: existing.rating }).map((_, i) => <Star key={i} size={14} className="text-violet fill-violet" />)}
          </div>
          <p className="text-[13.5px] italic text-mute">&quot;{existing.quote}&quot;</p>
        </>
      ) : (
        <form onSubmit={submit}>
          <p className="text-mute text-[13px] mb-3">How did this project go? Your review may be featured as a testimonial.</p>
          <div className="flex gap-1.5 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)}>
                <Star size={20} className={n <= rating ? "text-violet fill-violet" : "text-mute"} />
              </button>
            ))}
          </div>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            placeholder="Share your experience…"
            className="w-full rounded px-3.5 py-2.5 text-[13.5px] bg-white/[0.04] border border-white/[0.12] resize-none mb-3"
          />
          {error && <p className="text-[12.5px] mb-3" style={{ color: "#E24B4A" }}>{error}</p>}
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-1.5 text-[13px] px-4 py-2.5 rounded bg-gradient-to-r from-purple to-purple-2 disabled:opacity-50">
            <Check size={14} /> {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}
    </div>
  );
}
