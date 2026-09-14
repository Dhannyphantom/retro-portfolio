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
        <div>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.05em" }}>
            profile photo — shown on the hero &quot;ID card&quot;
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            <div style={{ width: 72, height: 72, border: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatarUrl} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)" }}>none</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <RetroFileUpload
                folder="avatars"
                accept="image/*"
                label="upload a new photo"
                onUploaded={(url) => set("avatarUrl", url)}
              />
            </div>
          </div>
          {form.avatarUrl && (
            <button
              onClick={() => set("avatarUrl", "")}
              data-cursor-hover
              style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", background: "none", border: "none", cursor: "none" }}
            >
              remove photo
            </button>
          )}
        </div>

        <Field label="name"><RetroInput value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="title"><RetroInput value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="bio"><RetroTextarea rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} /></Field>
        <Field label="&quot;meet the developer&quot; intro"><RetroTextarea rows={4} value={form.meetDeveloperBio || ""} onChange={(e) => set("meetDeveloperBio", e.target.value)} /></Field>
        <Field label="hero headlines — one per line, the hero types each one out on repeat">
          <RetroTextarea
            rows={4}
            value={(form.heroHeadlines || []).join("\n")}
            onChange={(e) => set("heroHeadlines", e.target.value.split("\n").map((s: string) => s.trim()).filter(Boolean))}
          />
        </Field>
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

        <div>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.05em" }}>
            social share image — shown when the site is shared on X, Slack, iMessage, etc. (recommend 1200×630)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            <div style={{ width: 96, height: 54, border: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form.ogImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.ogImageUrl} alt="social share preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)" }}>none</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <RetroFileUpload
                folder="og-image"
                accept="image/*"
                label="upload a share image"
                onUploaded={(url) => set("ogImageUrl", url)}
              />
            </div>
          </div>
          {form.ogImageUrl && (
            <button
              onClick={() => set("ogImageUrl", "")}
              data-cursor-hover
              style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", background: "none", border: "none", cursor: "none" }}
            >
              remove share image
            </button>
          )}
        </div>

        <div>
          <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 8, letterSpacing: "0.05em" }}>
            favicon — the browser tab icon (svg or png). Leave empty to use the default pixel-art avatar icon.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, border: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form.faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.faviconUrl} alt="favicon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 8, color: "var(--text-dim)" }}>default</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <RetroFileUpload
                folder="favicon"
                accept=".svg,.png,image/svg+xml,image/png"
                label="upload a favicon (svg or png)"
                onUploaded={(url) => set("faviconUrl", url)}
              />
            </div>
          </div>
          {form.faviconUrl && (
            <button
              onClick={() => set("faviconUrl", "")}
              data-cursor-hover
              style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", background: "none", border: "none", cursor: "none" }}
            >
              reset to default favicon
            </button>
          )}
        </div>

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
