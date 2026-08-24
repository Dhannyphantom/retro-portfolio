"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "list" | "boolean" | "number";
};

// A single reusable table + form UI that drives every simple admin collection
// (projects, experience, services, rate cards, testimonials, faqs, skills...)
// through the generic /api/admin/[collection] endpoints. `titleKey` picks
// which field to show as each row's headline in the table.
export default function ResourceManager({
  collection,
  fields,
  titleKey,
}: {
  collection: string;
  fields: FieldConfig[];
  titleKey: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/${collection}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
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
    await fetch(`/api/admin/${collection}/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-display font-semibold text-2xl capitalize">{collection}</h1>
        <button onClick={openNew} className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded bg-gradient-to-r from-purple to-purple-2">
          <Plus size={15} /> New
        </button>
      </div>

      {loading ? (
        <p className="text-mute text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-mute text-sm">Nothing here yet — click New to add the first one.</p>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(243,240,247,0.09)" }}>
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] last:border-b-0">
              <span className="text-sm truncate pr-4">{item[titleKey] || "(untitled)"}</span>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-hover w-8 h-8 rounded flex items-center justify-center" style={{ border: "1px solid rgba(243,240,247,0.12)" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(item._id)} className="icon-hover w-8 h-8 rounded flex items-center justify-center text-red-400" style={{ border: "1px solid rgba(243,240,247,0.12)" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-5" style={{ background: "rgba(7,5,11,0.8)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl p-6" style={{ background: "#131115", border: "1px solid rgba(180,92,255,0.136)" }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-lg">{editing._id ? "Edit" : "New"} {collection.slice(0, -1) || collection}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="block text-[13px] text-mute mb-1.5">{f.label}</span>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={editing[f.key] || ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="w-full rounded px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] resize-none"
                    />
                  ) : f.type === "list" ? (
                    <input
                      value={Array.isArray(editing[f.key]) ? editing[f.key].join(", ") : ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
                      placeholder="Comma-separated"
                      className="w-full rounded px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]"
                    />
                  ) : f.type === "boolean" ? (
                    <input type="checkbox" checked={!!editing[f.key]} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} className="w-4 h-4" />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                      className="w-full rounded px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]"
                    />
                  )}
                </label>
              ))}
              {error && <p className="text-[12.5px]" style={{ color: "#E24B4A" }}>{error}</p>}
              <button onClick={save} className="mt-2 text-sm px-4 py-3 rounded bg-gradient-to-r from-purple to-purple-2">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
