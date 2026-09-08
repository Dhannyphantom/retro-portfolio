"use client";
import { useState } from "react";
import { CURRENCIES } from "@/lib/currency";

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

  const input = "w-full rounded px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]";

  return (
    <div className="rounded-xl p-5" style={{ border: "1px solid rgba(var(--text-rgb),0.09)", background: "var(--panel)" }}>
      <h2 className="font-display text-[13px] mb-4 leading-relaxed">Budget & payments</h2>
      <label className="block mb-3">
        <span className="block text-[12.5px] text-mute mb-1.5">Currency</span>
        <select value={curr} onChange={(e) => setCurr(e.target.value)} className={input}>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <label className="block">
          <span className="block text-[12.5px] text-mute mb-1.5">Total budget</span>
          <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} className={input} />
        </label>
        <label className="block">
          <span className="block text-[12.5px] text-mute mb-1.5">Amount paid</span>
          <input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} className={input} />
        </label>
      </div>
      {saved && <p className="text-[12.5px] text-violet mb-2">Saved.</p>}
      <button onClick={save} className="text-[13px] px-4 py-2 rounded bg-gradient-to-r from-purple to-purple-2">Save</button>
      <p className="text-mute text-[12px] mt-3">
        Note: setting a total budget here is a manual override — the normal flow is sending a
        proposal in the conversation, which the client approves and which fills this in
        automatically (in USD; adjust currency here afterward if needed).
      </p>
    </div>
  );
}
