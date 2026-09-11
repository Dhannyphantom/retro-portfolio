"use client";
import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RetroPageShell from "./RetroPageShell";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import { RetroInput, RetroSubmit } from "./RetroFormKit";

function SetupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/account/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Something went wrong.");
      return;
    }
    router.push("/account/dashboard");
    router.refresh();
  };

  if (!token) {
    return (
      <TerminalWindow title="setup.sh — error">
        <div style={{ padding: 28, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
            This link is missing its setup token. Check the link from your booking confirmation, or contact support.
          </p>
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title="~/account — setup.sh">
      <form onSubmit={submit} style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 26, color: "var(--text)", margin: "0 0 2px" }}>
          set up your dashboard
        </GlitchText>
        <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", margin: "0 0 8px" }}>
          Choose a password to access your project — messages, milestones, and payments will all live here.
        </p>
        <div>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>password</span>
          <RetroInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>confirm password</span>
          <RetroInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p style={{ color: "var(--r)", fontSize: 11, fontFamily: "var(--font-retro-body)" }}>{error}</p>}
        <RetroSubmit type="submit" disabled={loading} style={{ width: "100%" }}>{loading ? "setting up..." : "create dashboard access →"}</RetroSubmit>
      </form>
    </TerminalWindow>
  );
}

export default function RetroAccountSetup({ osName }: { osName: string }) {
  return (
    <RetroPageShell osName={osName}>
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Suspense fallback={null}>
            <SetupForm />
          </Suspense>
        </div>
      </div>
    </RetroPageShell>
  );
}
