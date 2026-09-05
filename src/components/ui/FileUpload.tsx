"use client";
import { useRef, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";

export default function FileUpload({
  folder = "uploads",
  onUploaded,
  accept = ".pdf,.doc,.docx,.ppt,.pptx",
  label = "Attach a project document (optional)",
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
      <span className="block text-[13px] text-mute mb-1.5">{label}</span>
      {fileName ? (
        <div className="flex items-center justify-between rounded px-3.5 py-2.5 text-[13.5px] bg-white/[0.04] border border-white/[0.12]">
          <span className="inline-flex items-center gap-2 truncate"><FileText size={15} className="text-violet flex-shrink-0" /> {fileName}</span>
          <button type="button" onClick={clear} className="flex-shrink-0"><X size={15} /></button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 rounded px-3.5 py-3 text-[13.5px] text-mute border border-dashed border-white/[0.18] hover:border-violet/40 transition-colors"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? "Uploading…" : "Click to upload — PDF, Word, or PowerPoint"}
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p className="text-[12.5px] mt-1.5" style={{ color: "#E24B4A" }}>{error}</p>}
    </div>
  );
}
