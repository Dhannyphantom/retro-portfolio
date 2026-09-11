"use client";
import { useEffect, useState } from "react";
import { RetroInput, RetroTextarea } from "@/components/retro/RetroFormKit";
import RetroFileUpload from "@/components/retro/RetroFileUpload";
import GlitchText from "@/components/retro/GlitchText";
import SectionLabel from "@/components/retro/SectionLabel";

export default function AdminProfile() {
  const [form, setForm] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin-settings").then((r) => r.json()).then((d) => setForm(d.settings || {}));
  }, []);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setSocial = (k: string, v: string) => setForm((f: any) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  const save = async () => {
    setSaved(false);
    const payload = { ...form };
    delete payload._id;
    await fetch("/api/admin-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaved(true);
  };

  if (!form) return <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>loading…</p>;

  return (
    <div style={{ maxWidth: 560 }}>
      <SectionLabel n="03" label="PROFILE" />
      <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: "0 0 8px" }}>
        profile.
      </GlitchText>
      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
        This reflects everywhere on the site — nav, footer, hero, page metadata.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="name"><RetroInput value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="title"><RetroInput value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="bio"><RetroTextarea rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} /></Field>
        <Field label="&quot;meet the developer&quot; intro"><RetroTextarea rows={4} value={form.meetDeveloperBio || ""} onChange={(e) => set("meetDeveloperBio", e.target.value)} /></Field>
        <Field label="hero headline"><RetroInput value={form.heroHeadline || ""} onChange={(e) => set("heroHeadline", e.target.value)} /></Field>
        <Field label="email"><RetroInput value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="location"><RetroInput value={form.location || ""} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="github url"><RetroInput value={form.socials?.github || ""} onChange={(e) => setSocial("github", e.target.value)} /></Field>
        <Field label="linkedin url"><RetroInput value={form.socials?.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} /></Field>
        <RetroFileUpload folder="cv" accept=".pdf,.doc,.docx" label="cv file" onUploaded={(url) => set("cvUrl", url)} />
        {form.cvUrl && (
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginTop: -8 }}>
            current: <a href={form.cvUrl} target="_blank" rel="noreferrer" style={{ color: "var(--g)" }} data-cursor-hover>view uploaded cv</a>
          </p>
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
          <input type="checkbox" checked={!!form.cvEnabled} onChange={(e) => set("cvEnabled", e.target.checked)} /> CV download enabled
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)" }}>
          <input type="checkbox" checked={!!form.availability} onChange={(e) => set("availability", e.target.checked)} /> Currently available for projects
        </label>
        {saved && <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--g)" }}>saved.</p>}
        <button onClick={save} data-cursor-hover style={{ marginTop: 4, fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "12px 20px", background: "var(--white)", color: "var(--bg)", border: "none", cursor: "none" }}>
          save profile
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.05em" }}>{label}</span>
      {children}
    </label>
  );
}
