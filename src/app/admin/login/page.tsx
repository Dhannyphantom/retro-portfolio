"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import TerminalWindow from "@/components/retro/TerminalWindow";
import GlitchText from "@/components/retro/GlitchText";
import { RetroInput, RetroSubmit } from "@/components/retro/RetroFormKit";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Login failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <TerminalWindow title="~/admin — login.sh">
        <form onSubmit={submit} style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 28, color: "var(--text)", margin: "0 0 2px" }}>
            admin login
          </GlitchText>
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", margin: "0 0 8px" }}>
            Sign in to manage the portfolio.
          </p>
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>email</span>
            <RetroInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>password</span>
            <RetroInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)" }}>{error}</p>}
          <RetroSubmit type="submit" disabled={loading} style={{ width: "100%" }}>{loading ? "signing in..." : "sign in →"}</RetroSubmit>
        </form>
      </TerminalWindow>
    </div>
  );
}
