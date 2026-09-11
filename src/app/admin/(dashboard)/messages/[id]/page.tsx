"use client";
import { useEffect, useState, use as usePromise, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { RetroTextarea } from "@/components/retro/RetroFormKit";

type MessageDetail = {
  _id: string; name: string; email: string; message: string; status: string;
  createdAt: string; replies: { body: string; sentAt: string; emailedOk: boolean }[];
};

export default function AdminMessageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [msg, setMsg] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch(`/api/admin/messages/${id}`)
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const setStatus = async (status: string) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  const sendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError("");
    const res = await fetch(`/api/admin/messages/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    const d = await res.json();
    if (!res.ok) {
      setError(d.error || "Couldn't send that reply.");
    } else {
      setReply("");
      load();
      if (!d.emailed) setError("Reply saved, but email delivery isn't configured (see README — Brevo setup) so it wasn't emailed.");
    }
    setSending(false);
  };

  if (loading) return <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>loading…</p>;
  if (!msg) return <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>Message not found.</p>;

  return (
    <div style={{ maxWidth: 680 }}>
      <Link href="/admin/messages" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 20 }} data-cursor-hover>
        <ArrowLeft size={14} /> all messages
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-retro-display)", fontSize: 24, color: "var(--text)", margin: 0 }}>{msg.name}</h1>
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>{msg.email} · {new Date(msg.createdAt).toLocaleString()}</p>
        </div>
        <select
          value={msg.status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, padding: "8px 12px", background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "none" }}
        >
          <option value="unread">unread</option>
          <option value="read">read</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 16, margin: "20px 0", fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {msg.message}
      </div>

      {msg.replies.map((r, i) => (
        <div key={i} style={{ border: "1px solid var(--g)", background: "rgba(57,255,20,0.06)", padding: 16, marginBottom: 12, marginLeft: 32, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {r.body}
          <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 10 }}>{new Date(r.sentAt).toLocaleString()} {r.emailedOk ? "· emailed" : "· not emailed"}</div>
        </div>
      ))}

      <form onSubmit={sendReply} style={{ marginTop: 24 }}>
        <RetroTextarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="Write a reply — this will be emailed to them." style={{ marginBottom: 12 }} />
        {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)", marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={sending}
          data-cursor-hover
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "10px 18px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none", opacity: sending ? 0.6 : 1 }}
        >
          <Send size={14} /> {sending ? "sending..." : "send reply"}
        </button>
      </form>
    </div>
  );
}
