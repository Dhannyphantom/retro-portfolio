"use client";

const base: React.CSSProperties = {
  width: "100%",
  background: "var(--bg2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontFamily: "var(--font-retro-body)",
  fontSize: 12,
  padding: "10px 12px",
  outline: "none",
};

export function RetroField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </span>
      {children}
      {error && <p style={{ color: "var(--r)", fontSize: 10, fontFamily: "var(--font-retro-body)", marginTop: 4 }}>{error}</p>}
    </label>
  );
}

export function RetroInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, style, ...rest } = props;
  return <input {...rest} style={{ ...base, borderColor: error ? "var(--r)" : "var(--border)", ...style }} />;
}

export function RetroTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  const { error, style, ...rest } = props;
  return <textarea {...rest} style={{ ...base, resize: "none", borderColor: error ? "var(--r)" : "var(--border)", ...style }} />;
}

export function RetroSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { style, children, ...rest } = props;
  return (
    <select {...rest} style={{ ...base, ...style }}>
      {children}
    </select>
  );
}

export function RetroSubmit({ children, disabled, style, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      data-cursor-hover
      style={{
        padding: "12px 20px",
        background: "var(--white)",
        color: "var(--bg)",
        border: "none",
        cursor: "none",
        fontFamily: "var(--font-retro-body)",
        fontSize: 12,
        letterSpacing: "0.08em",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
