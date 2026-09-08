"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";

export default function AccountLoginPage() {
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-[360px] rounded-2xl p-8" style={{ border: "1px solid rgba(0,229,255,0.17)", background: "var(--panel)" }}>
        <h1 className="font-display text-[16px] mb-2 leading-relaxed">Project dashboard</h1>
        <p className="text-mute text-sm mb-6">Log in to see your messages, milestones and payments.</p>
        <label className="block mb-4">
          <span className="block text-[13px] text-mute mb-1.5">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
        </label>
        <label className="block mb-5">
          <span className="block text-[13px] text-mute mb-1.5">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
        </label>
        {error && <p className="text-[12.5px] mb-4" style={{ color: "#FF3B3B" }}>{error}</p>}
        <CTAButton variant="primary" type="submit" className="w-full">{loading ? "Signing in..." : "Sign in"}</CTAButton>
        <p className="text-mute text-[12.5px] text-center mt-5">
          No account yet? <Link href="/hire" className="text-neon">Submit a project brief</Link> to get one.
        </p>
      </form>
    </div>
  );
}
