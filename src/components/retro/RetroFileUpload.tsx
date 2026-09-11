"use client";
import { useRef, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";

export default function RetroFileUpload({
  folder = "uploads",
  onUploaded,
  accept = ".pdf,.doc,.docx,.ppt,.pptx",
  label = "attach a project document (optional)",
}: {
  folder?: string;
  onUploaded: (url: string, filename: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFileName(file.name);
      onUploaded(data.url, file.name);
    } catch (err: any) {
      setError(err.message || "Couldn't upload that file.");
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    setFileName("");
    onUploaded("", "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 6, letterSpacing: "0.08em" }}>{label}</span>
      {fileName ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", fontFamily: "var(--font-retro-body)", fontSize: 12, background: "var(--bg2)", border: "1px solid var(--border)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <FileText size={14} color="var(--g)" /> {fileName}
          </span>
          <button type="button" onClick={clear} data-cursor-hover style={{ background: "none", border: "none", cursor: "none", color: "var(--text-dim)" }}><X size={14} /></button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-cursor-hover
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px", fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)",
            background: "var(--bg2)", border: "1px dashed var(--border)", cursor: "none",
          }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "uploading..." : "click to upload — PDF, Word, or PowerPoint"}
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p style={{ color: "var(--r)", fontSize: 10, fontFamily: "var(--font-retro-body)", marginTop: 6 }}>{error}</p>}
    </div>
  );
}
