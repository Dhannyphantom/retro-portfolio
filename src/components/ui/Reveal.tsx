"use client";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
  from?: "up" | "left" | "right";
  className?: string;
};

const variants = {
  up: { hidden: { opacity: 0, y: 28, filter: "blur(2px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } },
  left: { hidden: { opacity: 0, x: -46, filter: "blur(2px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)" } },
  right: { hidden: { opacity: 0, x: 46, filter: "blur(2px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)" } },
};

// Re-animates every time it re-enters the viewport (amount tuned so it triggers a bit early).
export default function Reveal({ children, delay = 0, from = "up", className = "" }: Props) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.16 }}
      variants={variants[from]}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
