"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Check, X, FileText, Plus, Trash2 } from "lucide-react";

type Proposal = { budget: number; timeline: string; milestones?: { title: string; description?: string; dueDate?: string }[] };
type ThreadMessage = {
  _id: string;
  senderRole: "client" | "admin";
  senderName: string;
  body: string;
  proposal?: Proposal;
  proposalStatus?: "pending" | "approved" | "declined";
  createdAt: string;
};

const emptyMilestone = () => ({ title: "", description: "", dueDate: "" });

export default function ThreadPanel({ bookingId, viewerRole }: { bookingId: string; viewerRole: "client" | "admin" }) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState({ budget: "", timeline: "", milestones: [emptyMilestone()] });
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch(`/api/threads/${bookingId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [bookingId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

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

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: "1px solid rgba(243,240,247,0.09)", height: 520 }}>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-mute text-sm">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="text-mute text-sm">No messages yet — say hello to get things moving.</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderRole === viewerRole;
            return (
              <div key={m._id} className={`max-w-[85%] ${mine ? "self-end items-end" : "self-start items-start"} flex flex-col gap-1`}>
                <div
                  className="rounded-xl px-3.5 py-2.5 text-[13.5px]"
                  style={{
                    background: mine ? "linear-gradient(120deg, #8B2FE0, #4C1D95)" : "#131115",
                    border: mine ? "none" : "1px solid rgba(243,240,247,0.09)",
                    color: "#F3F0F7",
                  }}
                >
                  <div className="text-[11px] opacity-70 mb-0.5">{m.senderName}</div>
                  {m.body}
                </div>

                {m.proposal && (
                  <div className="w-full rounded-lg p-3.5 mt-1" style={{ border: "1px solid rgba(180,92,255,0.28)", background: "rgba(139,47,224,0.05)" }}>
                    <div className="flex items-center gap-1.5 text-[12px] font-mono text-violet mb-2">
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
                        <button onClick={() => decide(m._id, "approve")} className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded bg-gradient-to-r from-violet to-purple">
                          <Check size={13} /> Approve
                        </button>
                        <button onClick={() => decide(m._id, "decline")} className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded border border-white/[0.14]">
                          <X size={13} /> Decline
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11.5px] font-mono mt-1" style={{ color: m.proposalStatus === "approved" ? "#8FE3A6" : m.proposalStatus === "declined" ? "#E24B4A" : "#A79FB8" }}>
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

      <div className="border-t border-white/[0.08] p-3.5">
        {showProposal && viewerRole === "admin" && (
          <div className="mb-3 rounded-lg p-3.5 flex flex-col gap-2.5" style={{ border: "1px solid rgba(180,92,255,0.24)", background: "rgba(139,47,224,0.05)" }}>
            <div className="grid grid-cols-2 gap-2.5">
              <input placeholder="Budget (USD)" type="number" value={proposal.budget} onChange={(e) => setProposal({ ...proposal, budget: e.target.value })} className={inputClass} />
              <input placeholder="Timeline (e.g. 4-6 weeks)" value={proposal.timeline} onChange={(e) => setProposal({ ...proposal, timeline: e.target.value })} className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              {proposal.milestones.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input placeholder="Milestone title" value={m.title} onChange={(e) => { const ms = [...proposal.milestones]; ms[i] = { ...ms[i], title: e.target.value }; setProposal({ ...proposal, milestones: ms }); }} className={inputClass} />
                  <input placeholder="Due date" value={m.dueDate} onChange={(e) => { const ms = [...proposal.milestones]; ms[i] = { ...ms[i], dueDate: e.target.value }; setProposal({ ...proposal, milestones: ms }); }} className={inputClass} />
                  <button onClick={() => setProposal({ ...proposal, milestones: proposal.milestones.filter((_, idx) => idx !== i) })} className="text-mute px-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setProposal({ ...proposal, milestones: [...proposal.milestones, emptyMilestone()] })} className="inline-flex items-center gap-1 text-[12.5px] text-violet self-start">
                <Plus size={13} /> Add milestone
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-[12.5px] mb-2" style={{ color: "#E24B4A" }}>{error}</p>}

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
              style={{ border: "1px solid rgba(180,92,255,0.3)", color: showProposal ? "#F3F0F7" : "#B45CFF", background: showProposal ? "rgba(139,47,224,0.2)" : "transparent" }}
            >
              <FileText size={15} />
            </button>
          )}
          <button onClick={() => send(showProposal)} disabled={sending} className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple to-purple-2 disabled:opacity-50">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
