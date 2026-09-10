"use client";
import Link from "next/link";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  primary?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
};

export default function MagneticBtn({ children, onClick, href, external, primary = false, style = {}, type = "button" }: Props) {
  const { ref, onMove, onLeave } = useMagnetic(0.3);

  const baseStyle: React.CSSProperties = {
    padding: "11px 22px",
    background: primary ? "var(--white)" : "transparent",
    color: primary ? "var(--bg)" : "var(--r)",
    border: `1px solid ${primary ? "var(--white)" : "var(--r)"}`,
    cursor: "none",
    fontFamily: "var(--font-retro-body)",
    fontSize: 12,
    letterSpacing: "0.08em",
    transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s",
    display: "inline-block",
    ...style,
  };

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {/* @ts-expect-error motion-free ref */}
        <button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={baseStyle} data-cursor-hover>
          {children}
        </button>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {/* @ts-expect-error motion-free ref */}
        <button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={baseStyle} data-cursor-hover>
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button
      // @ts-expect-error motion-free ref
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      type={type}
      style={baseStyle}
      data-cursor-hover
    >
      {children}
    </button>
  );
}
