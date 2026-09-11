"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Archive } from "lucide-react";
import GlitchText from "@/components/retro/GlitchText";
import SectionLabel from "@/components/retro/SectionLabel";

type MessageRow = { _id: string; name: string; email: string; message: string; status: string; createdAt: string; replies?: unknown[] };

export default function AdminMessages() {
  const [items, setItems] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || "Couldn't load messages.");
        setItems(d.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SectionLabel n="02" label="MESSAGES" />
      <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: "0 0 8px" }}>
        messages.
      </GlitchText>
      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
        Contact form submissions — view, reply, and archive.
      </p>

      {loading ? (
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>loading…</p>
      ) : error ? (
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--r)" }}>{error}</p>
      ) : items.length === 0 ? (
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>No messages yet.</p>
      ) : (
        <div style={{ border: "1px solid var(--border)" }}>
          {items.map((m) => (
            <Link
              key={m._id}
              href={`/admin/messages/${m._id}`}
              data-cursor-hover
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}
            >
              <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ position: "relative", flexShrink: 0, color: m.status === "unread" ? "var(--g)" : "var(--text-dim)" }}>
                  {m.status === "unread" ? <Mail size={15} /> : <Archive size={15} />}
                  {m.status === "unread" && <span style={{ position: "absolute", top: -3, right: -3, width: 6, height: 6, borderRadius: "50%", background: "var(--r)" }} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text)" }}>{m.name} <span style={{ color: "var(--text-dim)" }}>— {m.email}</span></div>
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>{m.message}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                {!!m.replies?.length && <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--g)" }}>replied</span>}
                <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
