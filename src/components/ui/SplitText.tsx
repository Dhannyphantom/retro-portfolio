"use client";
import { motion } from "framer-motion";

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
          initial={{ opacity: 0, y: 16, rotateX: 45, filter: "blur(3px)" }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5, delay: (i * step) / 1000, ease: [0.16, 1, 0.3, 1] }}
        >
          {p === " " ? "\u00A0" : p}
          {by === "word" && i < parts.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
