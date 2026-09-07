import type { Config } from "tailwindcss";

// Retro CRT-terminal palette — matches the DHANNY_OS reference exactly:
// near-black void/panel, a single "phosphor" green as primary accent, cyan
// for secondary/info accents, magenta for hover states, amber for
// active/attention states. Deliberately few colors, deliberately flat —
// no gradients, no soft ambient glow.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0118",       // void
        ink2: "#120A1F",      // panel
        panelAlt: "#1A1030",  // panel-alt (window title bar stripe)
        retroBorder: "#3A2A5C",
        paper: "#D9D6E8",     // text
        mute: "#8A86A8",      // text-dim
        purple: { DEFAULT: "#39FF14", 2: "#1FAE0C" }, // phosphor green (primary)
        violet: "#00E5FF",    // cyan (secondary/info accent)
        magenta: "#FF2D95",
        amber: "#FFB400",
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"], // pixel font
        body: ["var(--font-body)", "monospace"],        // JetBrains Mono
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        spin2: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        spinReverse: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(-360deg)" } },
        breathe: { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.75" } },
        termBlink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        floatSmall: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        blink: { "50%": { opacity: "0" } },
        marchAnts: { to: { backgroundPosition: "40px 0, 40px 40px, 0 40px, 0 0" } },
      },
      animation: {
        spin2: "spin2 20s linear infinite",
        spinReverse: "spinReverse 20s linear infinite",
        breathe: "breathe 3s ease-in-out infinite",
        termBlink: "termBlink 1.1s steps(1) infinite",
        marquee: "marquee 26s linear infinite",
        floatSmall: "floatSmall 5s ease-in-out infinite",
        blink: "blink 1s steps(1) infinite",
        marchAnts: "marchAnts 0.6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
