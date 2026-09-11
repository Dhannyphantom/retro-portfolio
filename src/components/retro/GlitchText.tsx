"use client";

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
  // `data-text` drives the CSS glitch layers (::before/::after use
  // `content: attr(data-text)`), which needs a plain string — but callers
  // often pass mixed JSX children (e.g. `welcome back{name}.`), which React
  // represents as an array of nodes rather than a single string. Flatten
  // that down to text for the attribute while still rendering the original
  // `children` normally below.
  const text = Array.isArray(children)
    ? children.join("")
    : String(children ?? "");

  return (
    <Tag className={`retro-glitch ${className}`} data-text={text} style={style}>
      {children}
    </Tag>
  );
}
