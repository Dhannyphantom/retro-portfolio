"use client";
import { useEffect, useState, use as usePromise, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

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

  if (loading) return <p className="text-mute text-sm">Loading…</p>;
  if (!msg) return <p className="text-mute text-sm">Message not found.</p>;

  return (
    <div className="max-w-[680px]">
      <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-mute text-sm mb-6 hover:text-paper transition-colors">
        <ArrowLeft size={15} /> All messages
      </Link>

      <div className="flex justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="font-display text-[14px] leading-relaxed">{msg.name}</h1>
          <p className="text-mute text-sm">{msg.email} · {new Date(msg.createdAt).toLocaleString()}</p>
        </div>
        <select value={msg.status} onChange={(e) => setStatus(e.target.value)} className="text-sm rounded px-3 py-2 bg-white/[0.04] border border-white/[0.12]">
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* read-only — the original message is never editable here */}
      <div className="rounded-xl p-4 my-5 text-sm leading-relaxed whitespace-pre-wrap" style={{ border: "1px solid rgba(var(--text-rgb),0.09)", background: "var(--panel)" }}>
        {msg.message}
      </div>

      {msg.replies.map((r, i) => (
        <div key={i} className="rounded-xl p-4 mb-3 ml-8 text-sm leading-relaxed whitespace-pre-wrap" style={{ background: "linear-gradient(120deg, #39FF14, #1FAE0C)" }}>
          {r.body}
          <div className="text-[11px] opacity-70 mt-2">{new Date(r.sentAt).toLocaleString()} {r.emailedOk ? "· emailed" : "· not emailed"}</div>
        </div>
      ))}

      <form onSubmit={sendReply} className="mt-6">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Write a reply — this will be emailed to them."
          className="w-full rounded px-3.5 py-3 text-sm bg-white/[0.04] border border-white/[0.12] resize-none mb-3"
        />
        {error && <p className="text-[12.5px] mb-3" style={{ color: "#FF3B3B" }}>{error}</p>}
        <button type="submit" disabled={sending} className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded bg-gradient-to-r from-purple to-purple-2 disabled:opacity-50">
          <Send size={14} /> {sending ? "Sending..." : "Send reply"}
        </button>
      </form>
    </div>
  );
}
