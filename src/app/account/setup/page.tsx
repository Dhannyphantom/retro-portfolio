"use client";
import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CTAButton from "@/components/ui/CTAButton";

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
      <div className="w-full max-w-[380px] rounded-2xl p-8 text-center" style={{ border: "1px solid rgba(180,92,255,0.17)", background: "#131115" }}>
        <p className="text-mute text-sm">This link is missing its setup token. Check the link from your booking confirmation, or contact support.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-[380px] rounded-2xl p-8" style={{ border: "1px solid rgba(180,92,255,0.17)", background: "#131115" }}>
      <h1 className="font-display font-bold text-2xl mb-1">Set up your dashboard</h1>
      <p className="text-mute text-sm mb-6">Choose a password to access your project — messages, milestones, and payments will all live here.</p>
      <label className="block mb-4">
        <span className="block text-[13px] text-mute mb-1.5">Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
      </label>
      <label className="block mb-5">
        <span className="block text-[13px] text-mute mb-1.5">Confirm password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]" />
      </label>
      {error && <p className="text-[12.5px] mb-4" style={{ color: "#E24B4A" }}>{error}</p>}
      <CTAButton variant="primary" type="submit" className="w-full">{loading ? "Setting up..." : "Create dashboard access"}</CTAButton>
    </form>
  );
}

export default function AccountSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <SetupForm />
      </Suspense>
    </div>
  );
}
