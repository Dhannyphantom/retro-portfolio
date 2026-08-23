import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07050B",
        ink2: "#110C18",
        paper: "#F3F0F7",
        mute: "#A79FB8",
        purple: { DEFAULT: "#8B2FE0", 2: "#4C1D95" },
        violet: "#B45CFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        spin2: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        spinReverse: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(-360deg)" } },
        drift: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(30px,-20px) scale(1.06)" } },
        breathe: { "0%,100%": { opacity: "0.35" }, "50%": { opacity: "0.6" } },
        ambientGlow: { "0%,100%": { boxShadow: "0 0 5px 0px rgba(180,92,255,0.08)" }, "50%": { boxShadow: "0 0 14px 2px rgba(180,92,255,0.18)" } },
        borderRotate: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        floatSmall: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        spin2: "spin2 20s linear infinite",
        spinReverse: "spinReverse 20s linear infinite",
        drift: "drift 14s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        ambientGlow: "ambientGlow 3.6s ease-in-out infinite",
        borderRotate: "borderRotate 8s linear infinite",
        marquee: "marquee 26s linear infinite",
        floatSmall: "floatSmall 5s ease-in-out infinite",
        blink: "blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
