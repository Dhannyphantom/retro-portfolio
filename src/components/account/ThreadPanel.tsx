"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Check, X, FileText, Plus, Trash2, MessageCircle, CheckCheck } from "lucide-react";

type Proposal = { budget: number; timeline: string; milestones?: { title: string; description?: string; dueDate?: string }[] };
type ThreadMessage = {
  _id: string;
  senderRole: "client" | "admin";
  senderName: string;
  body: string;
  proposal?: Proposal;
  proposalStatus?: "pending" | "approved" | "declined";
  readAt?: string;
  createdAt: string;
};

const emptyMilestone = () => ({ title: "", description: "", dueDate: "" });

// Renders as a fixed drawer pinned to the right edge of the viewport, with a
// floating toggle tab — used identically on both the client's project page
// and the admin's booking detail page, so a conversation looks and behaves
// the same on either side. Polls every 4s so a message sent on one side
// shows up on the other without a manual refresh.
export default function ThreadPanel({ bookingId, viewerRole, defaultOpen = true }: { bookingId: string; viewerRole: "client" | "admin"; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState({ budget: "", timeline: "", milestones: [emptyMilestone()] });
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  const load = useCallback(() => {
    fetch(`/api/threads/${bookingId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    load();
    const id = setInterval(load, open ? 4000 : 15000);
    return () => clearInterval(id);
  }, [load, open]);

  useEffect(() => {
    if (messages.length !== prevCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      prevCount.current = messages.length;
    }
  }, [messages.length]);

  const send = async (withProposal: boolean) => {
    if (!body.trim()) return;
    setSending(true);
    setError("");
    const payload: any = { body };
    if (withProposal) {
      const milestones = proposal.milestones.filter((m) => m.title.trim());
      payload.proposal = { budget: Number(proposal.budget) || 0, timeline: proposal.timeline, milestones };
    }
    const res = await fetch(`/api/threads/${bookingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Couldn't send that.");
      setSending(false);
      return;
    }
    setBody("");
    setShowProposal(false);
    setProposal({ budget: "", timeline: "", milestones: [emptyMilestone()] });
    setSending(false);
    load();
  };

  const decide = async (messageId: string, decision: "approve" | "decline") => {
    const res = await fetch(`/api/threads/${bookingId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, decision }),
    });
    if (res.ok) load();
  };

  const inputClass = "w-full rounded px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]";
  const unreadCount = messages.filter((m) => m.senderRole !== viewerRole && !m.readAt).length;

  return (
    <>
      {/* toggle tab — stays visible whether the drawer is open or closed */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-3 rounded-l-xl transition-all"
        style={{
          right: open ? 380 : 0,
          background: "linear-gradient(120deg, #39FF14, #1FAE0C)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
        }}
        aria-label={open ? "Close conversation" : "Open conversation"}
      >
        <span className="relative">
          <MessageCircle size={18} />
          {!open && unreadCount > 0 && <span className="notif-dot" />}
        </span>
      </button>

      <div
        className="fixed top-0 right-0 h-screen z-30 flex flex-col transition-transform duration-300"
        style={{
          width: 380,
          maxWidth: "92vw",
          background: "var(--void)",
          borderLeft: "1px solid rgba(var(--text-rgb),0.09)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="px-4 py-4 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <span className="font-display font-semibold text-sm">Conversation</span>
          <button onClick={() => setOpen(false)}><X size={16} className="text-mute" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-mute text-sm">Loading conversation…</p>
          ) : messages.length === 0 ? (
            <p className="text-mute text-sm">No messages yet — say hello to get things moving.</p>
          ) : (
            messages.map((m) => {
              const mine = m.senderRole === viewerRole;
              return (
                <div key={m._id} className={`max-w-[90%] ${mine ? "self-end items-end" : "self-start items-start"} flex flex-col gap-1`}>
                  <div
                    className="rounded-xl px-3.5 py-2.5 text-[13.5px]"
                    style={{
                      background: mine ? "linear-gradient(120deg, #39FF14, #1FAE0C)" : "var(--panel)",
                      border: mine ? "none" : "1px solid rgba(var(--text-rgb),0.09)",
                      color: "var(--text)",
                    }}
                  >
                    <div className="text-[11px] opacity-70 mb-0.5">{m.senderName}</div>
                    {m.body}
                  </div>
                  {mine && (
                    <div className="flex items-center gap-1 text-[10.5px] text-mute pr-1">
                      {m.readAt ? <><CheckCheck size={11} className="text-neon" /> Read</> : <><Check size={11} /> Delivered</>}
                    </div>
                  )}

                  {m.proposal && (
                    <div className="w-full rounded-lg p-3.5 mt-1" style={{ border: "1px solid rgba(0,229,255,0.28)", background: "rgba(57,255,20,0.05)" }}>
                      <div className="flex items-center gap-1.5 text-[12px] font-mono text-neon mb-2">
                        <FileText size={13} /> PROJECT PROPOSAL
                      </div>
                      <div className="text-[13px] text-mute mb-1">Budget: <span className="text-paper">${m.proposal.budget.toLocaleString()}</span></div>
                      <div className="text-[13px] text-mute mb-2">Timeline: <span className="text-paper">{m.proposal.timeline}</span></div>
                      {!!m.proposal.milestones?.length && (
                        <ul className="text-[12.5px] text-mute list-disc list-inside mb-2">
                          {m.proposal.milestones.map((ms, i) => <li key={i}><span className="text-paper">{ms.title}</span>{ms.dueDate ? ` — ${ms.dueDate}` : ""}</li>)}
                        </ul>
                      )}
                      {m.proposalStatus === "pending" && viewerRole === "client" ? (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => decide(m._id, "approve")} className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded bg-gradient-to-r from-neon to-phosphor">
                            <Check size={13} /> Approve
                          </button>
                          <button onClick={() => decide(m._id, "decline")} className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded border border-white/[0.14]">
                            <X size={13} /> Decline
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11.5px] font-mono mt-1" style={{ color: m.proposalStatus === "approved" ? "#8FE3A6" : m.proposalStatus === "declined" ? "#FF3B3B" : "var(--text-dim)" }}>
                          {m.proposalStatus === "pending" ? "Awaiting client approval" : m.proposalStatus?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/[0.08] p-3.5 flex-shrink-0">
          {showProposal && viewerRole === "admin" && (
            <div className="mb-3 rounded-lg p-3.5 flex flex-col gap-2.5" style={{ border: "1px solid rgba(0,229,255,0.24)", background: "rgba(57,255,20,0.05)" }}>
              <input placeholder="Budget (USD)" type="number" value={proposal.budget} onChange={(e) => setProposal({ ...proposal, budget: e.target.value })} className={inputClass} />
              <input placeholder="Timeline (e.g. 4-6 weeks)" value={proposal.timeline} onChange={(e) => setProposal({ ...proposal, timeline: e.target.value })} className={inputClass} />
              <div className="flex flex-col gap-2">
                {proposal.milestones.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
                    <input placeholder="Milestone title" value={m.title} onChange={(e) => { const ms = [...proposal.milestones]; ms[i] = { ...ms[i], title: e.target.value }; setProposal({ ...proposal, milestones: ms }); }} className={inputClass} />
                    <button onClick={() => setProposal({ ...proposal, milestones: proposal.milestones.filter((_, idx) => idx !== i) })} className="text-mute px-2"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => setProposal({ ...proposal, milestones: [...proposal.milestones, emptyMilestone()] })} className="inline-flex items-center gap-1 text-[12.5px] text-neon self-start">
                  <Plus size={13} /> Add milestone
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-[12.5px] mb-2" style={{ color: "#FF3B3B" }}>{error}</p>}

          <div className="flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(showProposal)}
              placeholder="Type a message…"
              className={inputClass}
            />
            {viewerRole === "admin" && (
              <button
                onClick={() => setShowProposal((s) => !s)}
                className="px-3 rounded text-[12.5px] flex-shrink-0"
                style={{ border: "1px solid rgba(0,229,255,0.3)", color: showProposal ? "var(--text)" : "#00E5FF", background: showProposal ? "rgba(57,255,20,0.2)" : "transparent" }}
              >
                <FileText size={15} />
              </button>
            )}
            <button onClick={() => send(showProposal)} disabled={sending} className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-phosphor to-phosphor-2 disabled:opacity-50">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
