"use client";
import { useState } from "react";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";

type Milestone = { title: string; description?: string; dueDate?: string; status: string; media: string[] };

export default function MilestoneEditor({ bookingId, milestones }: { bookingId: string; milestones: Milestone[] }) {
  const [items, setItems] = useState<Milestone[]>(milestones.length ? milestones : []);
  const [saved, setSaved] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  const update = (i: number, patch: Partial<Milestone>) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
  };

  const addMedia = (i: number, url: string) => {
    if (!url.trim()) return;
    update(i, { media: [...(items[i].media || []), url.trim()] });
  };

  const uploadMedia = async (i: number, file: File) => {
    setUploadingIdx(i);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "milestone-media");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      addMedia(i, data.url);
    } catch (err: any) {
      setUploadError(err.message || "Couldn't upload that file.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const save = async () => {
    setSaved(false);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestones: items }),
    });
    setSaved(true);
  };

  const input = "w-full rounded px-2.5 py-2 text-[13px] bg-white/[0.04] border border-white/[0.12]";

  return (
    <div className="rounded-xl p-5" style={{ border: "1px solid rgba(var(--text-rgb),0.09)", background: "var(--panel)" }}>
      <h2 className="font-display text-[13px] mb-4 leading-relaxed">Milestones</h2>
      <div className="flex flex-col gap-4 mb-4">
        {items.map((m, i) => (
          <div key={i} className="rounded-lg p-3.5" style={{ border: "1px solid rgba(var(--text-rgb),0.08)" }}>
            <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
              <input placeholder="Title" value={m.title} onChange={(e) => update(i, { title: e.target.value })} className={input} />
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-mute px-2"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input placeholder="Due date" value={m.dueDate || ""} onChange={(e) => update(i, { dueDate: e.target.value })} className={input} />
              <select value={m.status} onChange={(e) => update(i, { status: e.target.value })} className={input}>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <textarea placeholder="Description" rows={2} value={m.description || ""} onChange={(e) => update(i, { description: e.target.value })} className={`${input} resize-none mb-2`} />
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(m.media || []).map((url, mi) => (
                <span key={mi} className="text-[11px] px-2 py-1 rounded truncate max-w-[140px]" style={{ background: "rgba(var(--text-rgb),0.06)" }}>{url}</span>
              ))}
            </div>
            <label className="inline-flex items-center gap-1.5 text-[12.5px] text-neon cursor-pointer">
              {uploadingIdx === i ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploadingIdx === i ? "Uploading…" : "Upload image or video"}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadMedia(i, e.target.files[0])}
              />
            </label>
            {uploadError && <p className="text-[11.5px] mt-1" style={{ color: "#FF3B3B" }}>{uploadError}</p>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setItems([...items, { title: "", description: "", dueDate: "", status: "pending", media: [] }])}
          className="inline-flex items-center gap-1.5 text-[13px] text-neon"
        >
          <Plus size={14} /> Add milestone
        </button>
        <button onClick={save} className="text-[13px] px-4 py-2 rounded bg-gradient-to-r from-phosphor to-phosphor-2">Save</button>
        {saved && <span className="text-[12.5px] text-neon">Saved.</span>}
      </div>
    </div>
  );
}
