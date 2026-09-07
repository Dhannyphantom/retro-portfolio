"use client";
import { useState } from "react";

const STATUSES = ["New", "Contacted", "In Discussion", "Proposal Sent", "Won", "Lost", "Archived"];

export default function StatusEditor({ bookingId, status }: { bookingId: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  const change = async (value: string) => {
    setCurrent(value);
    setSaving(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setSaving(false);
  };

  return (
    <select
      value={current}
      onChange={(e) => change(e.target.value)}
      disabled={saving}
      className="text-[12.5px] font-mono px-3 py-2 rounded"
      style={{ color: "#00E5FF", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(0,229,255,0.24)" }}
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
