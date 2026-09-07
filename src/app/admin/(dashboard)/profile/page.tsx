"use client";
import { useEffect, useState } from "react";
import FileUpload from "@/components/ui/FileUpload";

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

  if (!form) return <p className="text-mute text-sm">Loading…</p>;

  const input = "w-full rounded px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12]";

  return (
    <div className="max-w-[560px]">
      <h1 className="font-display text-[16px] mb-3 leading-relaxed">Profile</h1>
      <p className="text-mute text-sm mb-7">This reflects everywhere on the site — nav, footer, hero, page metadata.</p>

      <div className="flex flex-col gap-4">
        <Field label="Name"><input className={input} value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Title"><input className={input} value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Bio"><textarea rows={4} className={`${input} resize-none`} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} /></Field>
        <Field label="&quot;Meet the developer&quot; intro"><textarea rows={4} className={`${input} resize-none`} value={form.meetDeveloperBio || ""} onChange={(e) => set("meetDeveloperBio", e.target.value)} /></Field>
        <Field label="Hero headline"><input className={input} value={form.heroHeadline || ""} onChange={(e) => set("heroHeadline", e.target.value)} /></Field>
        <Field label="Email"><input className={input} value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Location"><input className={input} value={form.location || ""} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="GitHub URL"><input className={input} value={form.socials?.github || ""} onChange={(e) => setSocial("github", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input className={input} value={form.socials?.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} /></Field>
        <FileUpload
          folder="cv"
          accept=".pdf,.doc,.docx"
          label="CV file"
          onUploaded={(url) => set("cvUrl", url)}
        />
        {form.cvUrl && <p className="text-[12px] text-mute -mt-2">Current: <a href={form.cvUrl} target="_blank" rel="noreferrer" className="text-violet">view uploaded CV</a></p>}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.cvEnabled} onChange={(e) => set("cvEnabled", e.target.checked)} /> CV download enabled
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.availability} onChange={(e) => set("availability", e.target.checked)} /> Currently available for projects
        </label>
        {saved && <p className="text-[13px] text-violet">Saved.</p>}
        <button onClick={save} className="mt-2 text-sm px-4 py-3 rounded bg-gradient-to-r from-purple to-purple-2 w-full">Save profile</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] text-mute mb-1.5">{label}</span>
      {children}
    </label>
  );
}
