"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { RetroInput, RetroTextarea } from "@/components/retro/RetroFormKit";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "list" | "boolean" | "number";
};

// A single reusable table + form UI that drives every simple admin collection
// (projects, experience, services, rate cards, testimonials, faqs, skills...)
// through the generic /api/admin/[collection] endpoints. Same logic/props as
// before — visuals rewritten to the retro terminal theme.
export default function ResourceManager({
  collection,
  fields,
  titleKey,
  viewHref,
  hideCreate,
  hideEdit,
  title,
}: {
  collection: string;
  fields: FieldConfig[];
  titleKey: string;
  viewHref?: (item: any) => string;
  hideCreate?: boolean;
  hideEdit?: boolean;
  title?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setLoadError("");
    fetch(`/api/admin/${collection}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(
            r.status === 401
              ? "Your admin session has expired — log out and back in, then try again."
              : d.error || `Request failed (${r.status})`
          );
        }
        setItems(d.items || []);
      })
      .catch((err) => setLoadError(err.message || "Couldn't load this data."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [collection]);

  const openNew = () => {
    setEditing(Object.fromEntries(fields.map((f) => [f.key, f.type === "list" ? [] : f.type === "boolean" ? false : ""])));
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing({ ...item });
    setShowForm(true);
  };

  const save = async () => {
    setError("");
    const payload = { ...editing };
    delete payload._id;
    const isNew = !editing._id;
    const url = isNew ? `/api/admin/${collection}` : `/api/admin/${collection}/${editing._id}`;
    const method = isNew ? "POST" : "PATCH";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Something went wrong.");
      return;
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/${collection}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Couldn't delete that item.");
      return;
    }
    load();
  };

  const iconBtn: React.CSSProperties = {
    width: 30, height: 30, border: "1px solid var(--border)", background: "var(--bg2)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", cursor: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: 0, textTransform: "lowercase" }}>
          {title || collection}
        </h1>
        {!hideCreate && (
          <button
            onClick={openNew}
            data-cursor-hover
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "9px 16px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none" }}
          >
            <Plus size={14} /> new
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>loading…</p>
      ) : loadError ? (
        <div style={{ border: "1px solid var(--r)", background: "rgba(255,0,51,0.06)", padding: "14px 16px", fontFamily: "var(--font-retro-body)" }}>
          <p style={{ fontSize: 12, color: "var(--text)", margin: "0 0 4px" }}>Couldn&apos;t load {collection}</p>
          <p style={{ fontSize: 11, color: "var(--text-dim)", margin: 0 }}>{loadError}</p>
          <button onClick={load} style={{ marginTop: 10, fontSize: 11, color: "var(--g)", background: "none", border: "none", cursor: "none" }} data-cursor-hover>try again</button>
        </div>
      ) : items.length === 0 ? (
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>Nothing here yet — click New to add the first one.</p>
      ) : (
        <div style={{ border: "1px solid var(--border)" }}>
          {items.map((item) => (
            <div key={item._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
              <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                {item[titleKey] || "(untitled)"}
              </span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {viewHref && (
                  <Link href={viewHref(item)} data-cursor-hover style={iconBtn}><ExternalLink size={13} /></Link>
                )}
                {!hideEdit && (
                  <button onClick={() => openEdit(item)} data-cursor-hover style={iconBtn}><Pencil size={13} /></button>
                )}
                <button onClick={() => remove(item._id)} data-cursor-hover style={{ ...iconBtn, color: "var(--r)" }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.85)" }}>
          <div style={{ width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--window-bar)" }}>
              <h3 style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)", margin: 0 }}>
                {editing._id ? "edit" : "new"} {collection.slice(0, -1) || collection}
              </h3>
              <button onClick={() => setShowForm(false)} data-cursor-hover style={{ background: "none", border: "none", cursor: "none", color: "var(--text-dim)" }}><X size={18} /></button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {fields.map((f) => (
                <label key={f.key} style={{ display: "block" }}>
                  <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.05em" }}>{f.label}</span>
                  {f.type === "textarea" ? (
                    <RetroTextarea rows={3} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                  ) : f.type === "list" ? (
                    <RetroInput
                      value={Array.isArray(editing[f.key]) ? editing[f.key].join(", ") : ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                      placeholder="Comma-separated"
                    />
                  ) : f.type === "boolean" ? (
                    <input type="checkbox" checked={!!editing[f.key]} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} style={{ width: 16, height: 16 }} />
                  ) : (
                    <RetroInput
                      type={f.type === "number" ? "number" : "text"}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                    />
                  )}
                </label>
              ))}
              {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)" }}>{error}</p>}
              <button
                onClick={save}
                data-cursor-hover
                style={{ marginTop: 6, fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "11px 16px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none" }}
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
