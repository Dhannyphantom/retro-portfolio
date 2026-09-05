"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Archive } from "lucide-react";

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
      <h1 className="font-display font-semibold text-2xl mb-1">Messages</h1>
      <p className="text-mute text-sm mb-6">Contact form submissions — view, reply, and archive. No need to send yourself a message.</p>

      {loading ? (
        <p className="text-mute text-sm">Loading…</p>
      ) : error ? (
        <p className="text-[13px]" style={{ color: "#E24B4A" }}>{error}</p>
      ) : items.length === 0 ? (
        <p className="text-mute text-sm">No messages yet.</p>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(243,240,247,0.09)" }}>
          {items.map((m) => (
            <Link
              key={m._id}
              href={`/admin/messages/${m._id}`}
              className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0 flex items-center gap-3">
                <span className="relative flex-shrink-0">
                  {m.status === "unread" ? <Mail size={16} className="text-violet" /> : <Archive size={16} className="text-mute" />}
                  {m.status === "unread" && <span className="notif-dot" />}
                </span>
                <div className="min-w-0">
                  <div className="text-sm truncate">{m.name} <span className="text-mute">— {m.email}</span></div>
                  <div className="text-mute text-[12.5px] truncate max-w-[420px]">{m.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {!!m.replies?.length && <span className="text-[11px] font-mono text-violet">replied</span>}
                <span className="text-mute text-[12px]">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
