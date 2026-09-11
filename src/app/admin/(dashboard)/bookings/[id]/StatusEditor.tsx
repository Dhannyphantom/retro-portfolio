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
      style={{
        fontFamily: "var(--font-retro-body)", fontSize: 11, padding: "8px 12px",
        color: "var(--g)", background: "var(--bg2)", border: "1px solid var(--border)", cursor: "none",
      }}
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
