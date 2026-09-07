"use client";
import { motion } from "framer-motion";

// Retro typewriter-style character reveal — plain opacity, no 3D rotation
// or blur (those read as modern glassmorphism, not terminal type-in).
export default function SplitText({
  text,
  by = "char",
  step = 26,
  className = "",
}: {
  text: string;
  by?: "char" | "word";
  step?: number;
  className?: string;
}) {
  const parts = by === "char" ? text.split("") : text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.05, delay: (i * step) / 1000 }}
        >
          {p === " " ? "\u00A0" : p}
          {by === "word" && i < parts.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
