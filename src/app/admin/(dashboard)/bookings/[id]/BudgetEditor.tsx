"use client";
import { useState } from "react";
import { CURRENCIES } from "@/lib/currency";
import { RetroInput, RetroSelect } from "@/components/retro/RetroFormKit";

export default function BudgetEditor({ bookingId, totalBudget, amountPaid, currency }: { bookingId: string; totalBudget?: number; amountPaid?: number; currency?: string }) {
  const [total, setTotal] = useState(totalBudget || 0);
  const [paid, setPaid] = useState(amountPaid || 0);
  const [curr, setCurr] = useState(currency || "USD");
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaved(false);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalBudget: Number(total), amountPaid: Number(paid), currency: curr }),
    });
    setSaved(true);
  };

  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 20 }}>
      <h2 style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)", margin: "0 0 16px" }}>budget & payments</h2>
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>currency</span>
        <RetroSelect value={curr} onChange={(e) => setCurr(e.target.value)}>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </RetroSelect>
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>total budget</span>
          <RetroInput type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>amount paid</span>
          <RetroInput type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} />
        </label>
      </div>
      {saved && <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--g)", marginBottom: 8 }}>saved.</p>}
      <button onClick={save} data-cursor-hover style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "9px 18px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none" }}>save</button>
      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginTop: 14, lineHeight: 1.7 }}>
        Note: setting a total budget here is a manual override — the normal flow is sending a
        proposal in the conversation, which the client approves and which fills this in
        automatically (in USD; adjust currency here afterward if needed).
      </p>
    </div>
  );
}
