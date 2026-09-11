"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import { RetroInput, RetroSubmit } from "./RetroFormKit";

export default function RetroAccountLogin({ osName }: { osName: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/account/login", {
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
    router.push("/account/dashboard");
    router.refresh();
  };

  return (
    <RetroPageShell osName={osName}>
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <TerminalWindow title="~/account — login.sh">
            <form onSubmit={submit} style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
              <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 28, color: "var(--text)", margin: "0 0 2px" }}>
                project dashboard
              </GlitchText>
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", margin: "0 0 8px" }}>
                Log in to see your messages, milestones and payments.
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
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", textAlign: "center", margin: 0 }}>
                no account yet?{" "}
                <Link href="/hire" style={{ color: "var(--g)" }} data-cursor-hover>submit a project brief</Link> to get one.
              </p>
            </form>
          </TerminalWindow>
        </div>
      </div>
    </RetroPageShell>
  );
}
