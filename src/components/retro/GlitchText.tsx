"use client";

// The glitch effect duplicates `children` as text behind the real element
// (via the `data-text` attribute + CSS ::before/::after in globals.css), so
// it needs a plain string version of whatever was passed in. Callers mostly
// pass a single template-literal expression, but TSX can resolve JSX
// children to `string[]` (or other ReactNode shapes) depending on how the
// expression is written — accepting `React.ReactNode` here and flattening
// it ourselves is more robust than requiring every caller to pass a plain
// `string`.
function flattenToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToText).join("");
  return "";
}

export default function GlitchText({
  children,
  className = "",
  style = {},
  tag: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tag?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag
      className={`retro-glitch ${className}`}
      data-text={flattenToText(children)}
      style={style}
    >
      {children}
    </Tag>
  );
}
