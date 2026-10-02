"use client";
import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { RetroInput } from "@/components/retro/RetroFormKit";

const MAX_BYTES = 15 * 1024 * 1024; // mirrors the server-side limit in lib/r2.ts

// Image field for the admin forms: preview + upload button (goes through
// /api/upload → Cloudflare R2) + a plain URL input as a fallback, so an
// existing hosted image (or a pasted link) still works. Stores just the URL.
export default function ImageUploadField({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large — the limit is 15MB.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Couldn't upload that image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "stretch", marginBottom: 8 }}>
        <div
          style={{
            width: 120, height: 80, flexShrink: 0, border: "1px solid var(--border)", background: "var(--bg2)",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)" }}>no image</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            data-cursor-hover
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", cursor: "none",
              fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--g)",
              background: "var(--bg2)", border: "1px dashed var(--border)", opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {uploading ? "uploading…" : value ? "replace image" : "upload image"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              data-cursor-hover
              style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "none", color: "var(--r)", fontFamily: "var(--font-retro-body)", fontSize: 10, padding: 0 }}
            >
              <X size={11} /> remove
            </button>
          )}
        </div>
      </div>
      <RetroInput value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" />
      {error && <p style={{ color: "var(--r)", fontSize: 10, fontFamily: "var(--font-retro-body)", marginTop: 6 }}>{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </div>
  );
}
