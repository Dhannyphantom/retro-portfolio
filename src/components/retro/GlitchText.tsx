"use client";

export default function GlitchText({
  children,
  className = "",
  style = {},
  tag: Tag = "span",
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  tag?: keyof React.JSX.IntrinsicElements;
}) {
  // @ts-expect-error dynamic tag
  return (
    <Tag className={`retro-glitch ${className}`} data-text={children} style={style}>
      {children}
    </Tag>
  );
}
