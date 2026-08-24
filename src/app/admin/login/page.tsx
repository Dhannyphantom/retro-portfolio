"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import CTAButton from "@/components/ui/CTAButton";

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
    <form onSubmit={submit} className="w-full max-w-[360px] rounded-2xl p-8" style={{ border: "1px solid rgba(180,92,255,0.136)", background: "#131115" }}>
      <h1 className="font-display font-bold text-2xl mb-1">Admin login</h1>
      <p className="text-mute text-sm mb-6">Sign in to manage the portfolio.</p>
      <label className="block mb-4">
        <span className="block text-[13px] text-mute mb-1.5">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
      </label>
      <label className="block mb-5">
        <span className="block text-[13px] text-mute mb-1.5">Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
      </label>
      {error && <p className="text-[12.5px] mb-4" style={{ color: "#E24B4A" }}>{error}</p>}
      <CTAButton variant="primary" type="submit" className="w-full">{loading ? "Signing in..." : "Sign in"}</CTAButton>
    </form>
  );
}
