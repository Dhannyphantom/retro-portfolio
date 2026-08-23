"use client";
import { useRef, useState, MouseEvent, ElementType } from "react";

type Props = {
  as?: ElementType;
  strength?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

export default function Magnetic({ as, strength = 14, children, className = "", style, ...rest }: Props) {
  const Tag = (as || "button") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setT({ x: ((e.clientX - r.left) / r.width - 0.5) * strength, y: ((e.clientY - r.top) / r.height - 0.5) * strength });
  };
  const onLeave = () => setT({ x: 0, y: 0 });

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transform: `translate(${t.x}px, ${t.y}px)`, transition: "transform 0.25s cubic-bezier(.16,1,.3,1)", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
