"use client";
import { useState } from "react";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { RetroInput, RetroTextarea, RetroSelect } from "@/components/retro/RetroFormKit";

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

  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 20 }}>
      <h2 style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)", margin: "0 0 16px" }}>milestones</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
        {items.map((m, i) => (
          <div key={i} style={{ border: "1px solid var(--border)", background: "var(--bg2)", padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 8 }}>
              <RetroInput placeholder="Title" value={m.title} onChange={(e) => update(i, { title: e.target.value })} />
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} data-cursor-hover style={{ background: "none", border: "none", cursor: "none", color: "var(--text-dim)" }}><Trash2 size={14} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <RetroInput placeholder="Due date" value={m.dueDate || ""} onChange={(e) => update(i, { dueDate: e.target.value })} />
              <RetroSelect value={m.status} onChange={(e) => update(i, { status: e.target.value })}>
                <option value="pending">pending</option>
                <option value="in-progress">in progress</option>
                <option value="completed">completed</option>
              </RetroSelect>
            </div>
            <RetroTextarea placeholder="Description" rows={2} value={m.description || ""} onChange={(e) => update(i, { description: e.target.value })} style={{ marginBottom: 8 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {(m.media || []).map((url, mi) => (
                <span key={mi} style={{ fontSize: 10, fontFamily: "var(--font-retro-body)", padding: "4px 8px", background: "var(--bg3)", color: "var(--text-dim)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
              ))}
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--g)", cursor: "none" }} data-cursor-hover>
              {uploadingIdx === i ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploadingIdx === i ? "uploading…" : "upload image or video"}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedia(i, e.target.files[0])} />
            </label>
            {uploadError && <p style={{ color: "var(--r)", fontSize: 10, marginTop: 6 }}>{uploadError}</p>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => setItems([...items, { title: "", description: "", dueDate: "", status: "pending", media: [] }])}
          data-cursor-hover
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--g)", background: "none", border: "none", cursor: "none" }}
        >
          <Plus size={14} /> add milestone
        </button>
        <button onClick={save} data-cursor-hover style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "9px 18px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none" }}>save</button>
        {saved && <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--g)" }}>saved.</span>}
      </div>
    </div>
  );
}
