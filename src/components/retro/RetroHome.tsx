"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import RetroCursor from "./RetroCursor";
import RetroMatrixRain from "./RetroMatrixRain";
import TerminalWindow from "./TerminalWindow";
import GlitchText from "./GlitchText";
import SectionLabel from "./SectionLabel";
import MagneticBtn from "./MagneticBtn";
import NavDock from "./NavDock";
import OSMenuBar from "./OSMenuBar";
import { ACHIEVEMENTS, AchievementToast, type AchievementId } from "./RetroAchievements";
import { useInView } from "@/lib/hooks/useInView";
import { useTheme } from "@/lib/theme";
import SafeImage from "@/components/ui/SafeImage";
import RetroProjectCard from "./RetroProjectCard";
import RetroContactForm from "./RetroContactForm";
import RetroExperienceEntry from "./RetroExperienceEntry";
import SnakeGame from "@/components/games/SnakeGame";
import TicTacToe from "@/components/games/TicTacToe";
import MemoryMatch from "@/components/games/MemoryMatch";
import type { ProjectItem, ExperienceItem, ServiceItem, RateCardItem, TestimonialItem, FAQItem } from "@/types";

type TechStackItem = { name: string; iconUrl: string; showInHero?: boolean; showInMarquee?: boolean };
type StatItem = { icon?: string; value: number; suffix?: string; label: string };
type WorkflowStepItem = { icon?: string; title: string; description: string };
type PhotoItem = { src: string; caption?: string };
type VideoItem = { title: string; duration?: string; thumb: string; src: string };

export type RetroHomeProps = {
  name: string;
  headline: string;
  bio: string;
  meetDeveloperBio?: string;
  email?: string;
  location?: string;
  availability?: boolean;
  socials?: { github?: string; linkedin?: string; twitter?: string };
  cvUrl?: string;
  cvEnabled?: boolean;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  services: ServiceItem[];
  rateCards: RateCardItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  techstack: TechStackItem[];
  stats: StatItem[];
  workflowSteps: WorkflowStepItem[];
  philosophyLines: string[];
  photos: PhotoItem[];
  videos: VideoItem[];
};

const SECTION_IDS = ["hero", "about", "projects", "experience", "skills", "rates", "games", "contact"];

// ─── TYPING HOOK ─────────────────────────────────────────────────────────────
function useTyping(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(t);
      }, speed);
      return () => clearInterval(t);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);
  return displayed;
}

// ─── EXPERIENCE ENTRY (see RetroExperienceEntry.tsx) ─────────────────────────

// ─── INTERACTIVE TERMINAL ─────────────────────────────────────────────────────
function InteractiveTerminal({
  slug,
  bio,
  projectCount,
  skillNames,
  onCommand,
}: {
  slug: string;
  bio: string;
  projectCount: number;
  skillNames: string[];
  onCommand: (cmd: string) => void;
}) {
  const commands: Record<string, string | (() => string)> = {
    help: "Available commands:\n  whoami · about · projects · experience · skills\n  contact · date · clear",
    whoami: `guest@${slug} — just visiting, but welcome anyway.`,
    about: bio,
    projects: `${projectCount} shipped projects — scroll to PROJECTS or run 'ls projects'.`,
    "ls projects": `${projectCount} entries — see the PROJECTS window below for details.`,
    experience: "Scroll down to the EXPERIENCE window for the full timeline.",
    skills: skillNames.join(" · ") || "React · Next.js · Node.js · MongoDB",
    contact: "Head to the CONTACT window below to start a project.",
    ls: "about.app  projects/  experience.log  skills.dat  games/  contact.sh",
    date: () => new Date().toString(),
    sudo: "Nice try. Permission denied: you are not root here.",
    matrix: "Wake up... the matrix rain behind this page is real, by the way.",
  };

  const [history, setHistory] = useState<{ type: "in" | "out"; text: string }[]>([
    { type: "out", text: `${slug}OS — type 'help' to start` },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setCmdHistory((h) => [cmd, ...h]);
    setCmdIdx(-1);
    const base = [...history, { type: "in" as const, text: `${slug}@os:~ $ ${raw}` }];
    if (cmd === "clear") {
      setHistory([{ type: "out", text: `${slug}OS — type 'help' to start` }]);
      setInput("");
      onCommand(cmd);
      return;
    }
    const resolver = commands[cmd];
    const output = resolver ? (typeof resolver === "function" ? resolver() : resolver) : `command not found: ${cmd}\ntry 'help'`;
    setHistory([...base, { type: "out", text: output }]);
    setInput("");
    onCommand(cmd);
  };

  return (
    <div style={{ background: "#050505", border: "1px solid var(--border)", height: 280, display: "flex", flexDirection: "column" }} onClick={() => inputRef.current?.focus()}>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        {history.map((h, i) => (
          <div key={i} style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, lineHeight: 1.7, color: h.type === "in" ? "var(--g)" : "#999", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {h.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--g)", fontFamily: "var(--font-retro-body)", fontSize: 12 }}>{slug}@os:~ $</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run(input);
            if (e.key === "ArrowUp") { const n = Math.min(cmdIdx + 1, cmdHistory.length - 1); setCmdIdx(n); setInput(cmdHistory[n] ?? ""); }
            if (e.key === "ArrowDown") { const n = Math.max(cmdIdx - 1, -1); setCmdIdx(n); setInput(n === -1 ? "" : cmdHistory[n]); }
          }}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--g)", caretColor: "var(--g)" }}
          autoComplete="off"
          spellCheck={false}
          placeholder="type a command..."
        />
      </div>
    </div>
  );
}

// ─── ID CARD AVATAR ────────────────────────────────────────────────────────────
function IdCardAvatar({ glitch, onHover }: { glitch: boolean; onHover: () => void }) {
  return (
    <div
      style={{ flex: 1, border: "2px solid var(--border)", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, minHeight: 200, position: "relative", overflow: "hidden", cursor: "none" }}
      onMouseEnter={onHover}
      data-cursor-hover
    >
      <svg viewBox="0 0 80 100" width={160} style={{ imageRendering: "pixelated" }}>
        <rect x={25} y={8} width={30} height={30} fill="#c8a882" />
        <rect x={22} y={4} width={36} height={14} fill="#1a0d00" rx={2} />
        <rect x={20} y={14} width={6} height={8} fill="#1a0d00" />
        <rect x={54} y={14} width={6} height={8} fill="#1a0d00" />
        <rect x={26} y={22} width={10} height={7} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
        <rect x={44} y={22} width={10} height={7} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
        <line x1={36} y1={25} x2={44} y2={25} stroke="#1a1a1a" strokeWidth={1} />
        <rect x={29} y={24} width={4} height={3} fill="#1a0a00" />
        <rect x={47} y={24} width={4} height={3} fill="#1a0a00" />
        <path d="M32,34 Q40,40 48,34" fill="none" stroke="#8a5a3a" strokeWidth={1.5} />
        <rect x={30} y={34} width={20} height={4} fill="#2a1a0a" />
        <rect x={18} y={38} width={44} height={50} fill="#1a1a1a" />
        <rect x={22} y={42} width={36} height={44} fill="#222" />
        <line x1={40} y1={42} x2={40} y2={86} stroke="#1a1a1a" strokeWidth={2} />
        <path d="M32,50 Q40,52 48,50" fill="none" stroke="#aaa" strokeWidth={1} />
        <rect x={4} y={38} width={14} height={40} fill="#1a1a1a" />
        <rect x={62} y={38} width={14} height={40} fill="#1a1a1a" />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.08) 4px,rgba(0,0,0,0.08) 5px)", pointerEvents: "none" }} />
      {glitch && <div style={{ position: "absolute", inset: 0, border: "2px solid var(--r)", boxShadow: "inset 0 0 20px rgba(255,0,51,0.3)" }} />}
    </div>
  );
}

// ─── MAIN RETRO HOME ────────────────────────────────────────────────────────
export default function RetroHome(props: RetroHomeProps) {
  const {
    name, headline, bio, meetDeveloperBio, email, location, availability, socials,
    projects, experience, services, rateCards, testimonials, faqs,
    techstack, stats, workflowSteps, philosophyLines, photos, videos,
  } = props;

  const slug = name.toLowerCase().replace(/\s+/g, "");
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  const [activeSection, setActiveSection] = useState("hero");
  const [unlockedAch, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [toastQueue, setToastQueue] = useState<AchievementId[]>([]);
  const [visitedSections, setVisited] = useState<Set<string>>(new Set(["hero"]));
  const [avatarHovers, setAvatarHovers] = useState(0);
  const [glitchManual, setGlitchManual] = useState(false);
  const [gameTab, setGameTab] = useState<"snake" | "ttt" | "memory">("snake");
  const konamiRef = useRef<string[]>([]);
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setToastQueue((q) => [...q, id]);
      return next;
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => unlock("BOOT"), 2500);
    if (new Date().getHours() < 5) unlock("NIGHT_OWL");
    return () => clearTimeout(t);
  }, [unlock]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI.length) konamiRef.current.shift();
      if (JSON.stringify(konamiRef.current) === JSON.stringify(KONAMI)) unlock("KONAMI");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlock]);

  useEffect(() => {
    const obs = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setActiveSection(id);
            setVisited((prev) => new Set(prev).add(id));
          }
        },
        { threshold: 0.4 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    if (SECTION_IDS.every((s) => visitedSections.has(s))) unlock("EXPLORER");
  }, [visitedSections, unlock]);

  useEffect(() => {
    if (light) unlock("LIGHT_MODE");
  }, [light, unlock]);

  const l1 = useTyping(`> ${slug}OS v1.0 — initializing...`, 35, 300);
  const l2 = useTyping("> loading projects.dll .......... [ok]", 30, 1600);
  const l3 = useTyping("> spawning recruiter_attractor.exe ... [ok]", 28, 3000);
  const l4 = useTyping("> verifying caffeine levels ......... [ok]", 28, 4400);
  const l5 = useTyping("> READY.", 60, 5400);

  const renderBootLine = (line: string) => {
    if (!line.includes("[ok]")) return <div>{line}</div>;
    const [pre] = line.split("[ok]");
    return (
      <div>
        <span style={{ color: "var(--text-dim)" }}>{pre}</span>
        <span style={{ color: "var(--g)" }}>[ok]</span>
      </div>
    );
  };

  const triggerGlitch = () => {
    unlock("GLITCH");
    setGlitchManual(true);
    setTimeout(() => setGlitchManual(false), 800);
  };

  const dismissToast = useCallback(() => setToastQueue((q) => q.slice(1)), []);

  const skillNames = techstack.map((t) => t.name);
  const totalAch = Object.keys(ACHIEVEMENTS).length;

  return (
    <div className="retro-root" style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <RetroCursor />
      <RetroMatrixRain light={light} />
      <div className="retro-noise-overlay" />

      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 10000, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        {toastQueue[0] && <AchievementToast key={toastQueue[0]} id={toastQueue[0]} onDone={dismissToast} />}
      </div>

      <div style={{ position: "fixed", top: 36, left: 20, zIndex: 1000, fontFamily: "var(--font-retro-pixel)", fontSize: 7, color: "var(--border)", letterSpacing: "0.1em" }}>
        ACH {unlockedAch.size}/{totalAch}
      </div>

      <OSMenuBar osName={`${name.split(" ")[0].toLowerCase()}OS`} />

      {/* ─── HERO ─── */}
      <section id="hero" style={{ paddingTop: 28, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
          <TerminalWindow title={`~/${slug} — login.sh`} hint="zsh — 80×24">
            <div className="retro-hero-grid">
              <div style={{ padding: "32px 36px", borderRight: "1px solid var(--border)" }}>
                <div style={{ marginBottom: 28, fontFamily: "var(--font-retro-body)", fontSize: 13, lineHeight: 2.2, color: "var(--text-dim)" }}>
                  {l1 && renderBootLine(l1)}
                  {l2 && renderBootLine(l2)}
                  {l3 && renderBootLine(l3)}
                  {l4 && renderBootLine(l4)}
                  {l5 && <div style={{ color: "var(--text)" }}>{l5}</div>}
                </div>

                <SectionLabel n="00" label="HELLO_WORLD" />

                <GlitchText
                  tag="h1"
                  className={`retro-scan-tear ${glitchManual ? "retro-glitch-active" : ""}`}
                  style={{ fontFamily: "var(--font-retro-display)", fontSize: "clamp(48px,9vw,100px)", lineHeight: 0.95, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}
                >
                  {(name.split(" ")[0] || name).toUpperCase()}
                </GlitchText>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
                  <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: "clamp(48px,9vw,100px)", lineHeight: 0.95, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
                    {(name.split(" ").slice(1).join(" ") || "DEV").toUpperCase()}.
                  </GlitchText>
                  <span style={{ width: 14, height: 14, background: "var(--r)", display: "inline-block", marginBottom: 14, flexShrink: 0 }} />
                </div>

                <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 480, marginBottom: 28 }}>
                  {headline}
                  <br />
                  {bio}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <MagneticBtn primary onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                    ▶ view projects
                  </MagneticBtn>
                  <MagneticBtn href="/hire">start a project.exe</MagneticBtn>
                  <MagneticBtn onClick={triggerGlitch} style={{ color: "var(--text-dim)", borderColor: "var(--border)" }}>▒</MagneticBtn>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em" }}>· STATUS</span>
                  <span className="retro-status-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: availability ? "var(--g)" : "var(--text-dim)", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--g)" }}>
                    {availability ? "available for new projects" : "currently booked"}
                  </span>
                </div>
              </div>

              <div style={{ padding: 24, background: "var(--bg2)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                  <span>ID_CARD.PNG</span><span>v1.0</span>
                </div>
                <IdCardAvatar
                  glitch={glitchManual}
                  onHover={() => { const n = avatarHovers + 1; setAvatarHovers(n); if (n >= 5) unlock("STALKER"); }}
                />
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>
                  <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 20, color: "var(--text)", marginBottom: 10 }}>{name.toUpperCase()}</div>
                  {[["CLASS", "SOFTWARE DEV"], ["TYPE", "FULL-STACK"], ["LOC", location || "Remote"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <span style={{ minWidth: 56, color: "var(--text-dim)" }}>{k}</span>
                      <span style={{ color: "var(--text)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", padding: "6px 16px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
              <span>// session started</span>
              <span>CONNECTED · 1 user</span>
            </div>
          </TerminalWindow>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="about.app" hint="interactive · type to explore">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="01" label="ABOUT" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 12px" }}>
              hi, I&apos;m {name.split(" ")[0]}.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 28, maxWidth: 600 }}>
              poke around the terminal below — type <span style={{ color: "var(--g)" }}>`help`</span> to start.
            </p>
            <div className="retro-about-grid">
              <TerminalWindow title={`${slug}@os — bash`} hint="80×24">
                <InteractiveTerminal
                  slug={slug}
                  bio={bio}
                  projectCount={projects.length}
                  skillNames={skillNames}
                  onCommand={(cmd) => { if (cmd !== "clear") unlock("TERMINAL"); }}
                />
              </TerminalWindow>
              <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "16px 20px" }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 16 }}>· SYSTEM_INFO</div>
                {[
                  ["LOCATION", location || "Remote"],
                  ["STATUS", availability ? "available · new projects" : "currently booked"],
                  ["STACK", skillNames.slice(0, 3).join(" · ") || "React · Node · Mongo"],
                  ["PROJECTS", `${projects.length} shipped`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", flexShrink: 0 }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {!!workflowSteps.length && (
              <div style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.15em", marginBottom: 16 }}>· HOW_I_WORK</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {workflowSteps.map((w, i) => {
                    const Icon = (Icons as any)[w.icon || "Search"] || Icons.Search;
                    return (
                      <div key={w.title} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", padding: "8px 12px", background: "var(--tag-bg)" }}>
                        <Icon size={14} color="var(--g)" />
                        <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text)" }}>{i + 1}. {w.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!!philosophyLines.length && (
              <div style={{ marginTop: 32, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.15em", marginBottom: 12 }}>· PHILOSOPHY</div>
                {philosophyLines.map((line, i) => (
                  <div key={line} style={{ fontFamily: "var(--font-retro-display)", fontSize: 18, color: i % 2 === 0 ? "var(--text)" : "var(--g)", lineHeight: 1.5 }}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TerminalWindow>
      </section>

      {/* ─── PROJECTS ─── */}
      <section id="projects" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="projects/" hint={`${projects.length} items · sorted by impact`}>
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="02" label="PROJECTS" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              things I&apos;ve shipped.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 32 }}>
              A sampler. Hover the cards. Click through for source + live demos.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
              {projects.map((p, i) => <RetroProjectCard key={p.slug} p={p} idx={i} />)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", padding: "6px 16px", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", display: "flex", justifyContent: "space-between" }}>
            <span>// shipping things</span>
            <MagneticBtn href="/projects" style={{ padding: "4px 10px", fontSize: 9, border: "none" }}>view all →</MagneticBtn>
          </div>
        </TerminalWindow>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section id="experience" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="experience.log" hint="most recent first">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="03" label="EXPERIENCE" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              receipts.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 32 }}>
              Roles where I&apos;ve shipped things people actually depend on.
            </p>
            {experience.map((e, i) => (
              <RetroExperienceEntry key={e.role + e.organization} item={e} idx={i} isLast={i === experience.length - 1} />
            ))}
          </div>
        </TerminalWindow>
      </section>

      {/* ─── SKILLS ─── */}
      <section id="skills" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="skills.dat" hint="read-only">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="04" label="SKILLS" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 32px" }}>
              the stack.
            </GlitchText>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 32 }}>
              {services.map((s) => {
                const Icon = (Icons as any)[s.icon || "Code2"] || Icons.Code2;
                return (
                  <div key={s.title} style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Icon size={16} color="var(--g)" />
                      <span style={{ fontFamily: "var(--font-retro-display)", fontSize: 18, color: "var(--text)" }}>{s.title}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                  </div>
                );
              })}
            </div>
            {!!stats.length && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginTop: 32 }}>
                {stats.map((st) => (
                  <div key={st.label} style={{ border: "1px solid var(--border)", padding: "14px 16px", background: "var(--tag-bg)", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 30, color: "var(--g)" }}>{st.value}{st.suffix}</div>
                    <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            )}
            {!!techstack.length && (
              <div style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.15em", marginBottom: 16 }}>TOOLING</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {techstack.map((t) => (
                    <span key={t.name} className="retro-metro-tile" style={{ padding: "6px 12px", border: "1px solid var(--border)", fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.05em", background: "var(--tag-bg)" }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TerminalWindow>
      </section>

      {/* ─── RATES / TESTIMONIALS / FAQ ─── */}
      <section id="rates" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="rates.sh" hint="pricing · testimonials · faq">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="05" label="RATES" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 32px" }}>
              let&apos;s talk business.
            </GlitchText>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16, marginBottom: 48 }}>
              {rateCards.map((r) => (
                <div key={r.name} style={{ border: `1px solid ${r.recommended ? "var(--g)" : "var(--border)"}`, background: "var(--card-bg)", padding: "20px 20px 24px", position: "relative" }}>
                  {r.recommended && <span style={{ position: "absolute", top: -10, left: 16, fontSize: 9, fontFamily: "var(--font-retro-body)", background: "var(--g)", color: "#000", padding: "2px 8px" }}>RECOMMENDED</span>}
                  <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)" }}>{r.name}</div>
                  <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 32, color: "var(--text)", margin: "6px 0" }}>{r.price} <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{r.unit}</span></div>
                  <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 14 }}>{r.description}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                    {(r.features || []).map((f) => (
                      <div key={f} style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>· {f}</div>
                    ))}
                  </div>
                  <MagneticBtn href="/hire" primary={!!r.recommended} style={{ width: "100%", textAlign: "center" }}>get started</MagneticBtn>
                </div>
              ))}
            </div>

            {!!testimonials.length && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.15em", marginBottom: 16 }}>· TESTIMONIALS</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                  {testimonials.map((t) => (
                    <div key={t.clientName} style={{ border: "1px solid var(--border)", background: "var(--tag-bg)", padding: "16px 18px" }}>
                      <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text)", lineHeight: 1.7, marginBottom: 10, fontStyle: "italic" }}>&quot;{t.quote}&quot;</div>
                      <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--g)" }}>{t.clientName}</div>
                      <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)" }}>{[t.position, t.company].filter(Boolean).join(", ")}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <MagneticBtn href="/testimonials/new" style={{ padding: "6px 12px", fontSize: 10 }}>leave a review →</MagneticBtn>
                </div>
              </div>
            )}

            {!!faqs.length && (
              <div>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.15em", marginBottom: 16 }}>· FAQ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {faqs.map((f) => (
                    <details key={f.question} style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "10px 14px" }}>
                      <summary style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text)", cursor: "none" }} data-cursor-hover>{f.question}</summary>
                      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.7, marginTop: 8 }}>{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TerminalWindow>
      </section>

      {/* ─── MEET THE DEVELOPER (photos/videos) ─── */}
      {(photos.length > 0 || videos.length > 0) && (
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <TerminalWindow title="media.gallery" hint="more than the code">
            <div style={{ padding: "32px 36px" }}>
              <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8, marginBottom: 24, maxWidth: 600 }}>{meetDeveloperBio}</p>
              {!!photos.length && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: videos.length ? 24 : 0 }}>
                  {photos.map((p, i) => (
                    <div key={p.src + i} style={{ border: "1px solid var(--border)" }}>
                      <SafeImage src={p.src} alt={p.caption} className="w-full h-[130px] object-cover grayscale" iconSize={20} />
                      {p.caption && <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)", padding: "6px 8px", textAlign: "center" }}>{p.caption}</div>}
                    </div>
                  ))}
                </div>
              )}
              {!!videos.length && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                  {videos.map((v) => (
                    <div key={v.title} style={{ border: "1px solid var(--border)" }}>
                      <div style={{ background: "var(--window-bar)", borderBottom: "1px solid var(--border)", padding: "4px 10px", fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--text-dim)" }}>{v.title}</div>
                      <video src={v.src} poster={v.thumb} controls className="w-full block" style={{ maxHeight: 140, background: "#000" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TerminalWindow>
        </section>
      )}

      {/* ─── GAMES ─── */}
      <section id="games" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="games/" hint="fully interactive">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="06" label="GAMES" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              take a break.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 32 }}>
              You&apos;ve scrolled far enough. Play a game. Unlock achievements. Try ↑↑↓↓←→←→BA.
            </p>
            <div className="retro-games-grid">
              <TerminalWindow title="ARCADE.EXE" hint={gameTab.toUpperCase()}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                  {(["snake", "ttt", "memory"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setGameTab(t); unlock("GAMER"); }}
                      data-cursor-hover
                      style={{
                        flex: 1, padding: "10px", fontFamily: "var(--font-retro-body)", fontSize: 10, letterSpacing: "0.08em",
                        background: gameTab === t ? "var(--white)" : "transparent",
                        color: gameTab === t ? "var(--bg)" : "var(--text-dim)",
                        border: "none", borderRight: "1px solid var(--border)", cursor: "none",
                      }}
                    >
                      {t === "snake" ? "SNAKE.EXE" : t === "ttt" ? "TICTACTOE.EXE" : "MEMORY.EXE"}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
                  {gameTab === "snake" && <SnakeGame onWin={() => unlock("GAMER")} />}
                  {gameTab === "ttt" && <TicTacToe onWin={() => unlock("GAMER")} />}
                  {gameTab === "memory" && <MemoryMatch onWin={() => unlock("GAMER")} />}
                </div>
              </TerminalWindow>

              <div>
                <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--r)", letterSpacing: "0.15em", marginBottom: 16 }}>
                  · ACHIEVEMENTS ({unlockedAch.size}/{totalAch})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
                    const done = unlockedAch.has(id as AchievementId);
                    return (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid", borderColor: done ? "var(--border)" : "var(--bg3)", background: done ? "var(--card-bg)" : "var(--bg)", opacity: done ? 1 : 0.4, transition: "all 0.3s" }}>
                        <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 14, color: done ? "var(--g)" : "var(--border)", minWidth: 20 }}>{done ? a.icon : "▪"}</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-retro-pixel)", fontSize: 7, color: done ? "var(--text)" : "var(--border)", marginBottom: 2 }}>{a.title}</div>
                          <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 9, color: done ? "var(--text-dim)" : "var(--bg3)" }}>{a.desc}</div>
                        </div>
                        {done && <span style={{ marginLeft: "auto", fontFamily: "var(--font-retro-pixel)", fontSize: 6, color: "var(--g)" }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", border: "1px solid var(--bg3)", fontFamily: "var(--font-retro-body)", fontSize: 9, color: "var(--border)" }}>
                  psst: ↑↑↓↓←→←→BA
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "80px 24px 160px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <TerminalWindow title="contact.sh" hint="run to connect">
          <div style={{ padding: "32px 36px" }}>
            <SectionLabel n="07" label="CONTACT" />
            <GlitchText tag="h2" style={{ fontFamily: "var(--font-retro-display)", fontSize: 44, color: "var(--text)", margin: "0 0 8px" }}>
              let&apos;s build.
            </GlitchText>
            <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 500, marginBottom: 32 }}>
              open to new projects and interesting problems.<br />
              {location || "remote"} — remote-friendly.
            </p>

            <div className="retro-contact-grid">
              <RetroContactForm onSent={() => unlock("CONTACT")} />

              <div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  {email && <MagneticBtn href={`mailto:${email}`} external onClick={() => unlock("CONTACT")}>email →</MagneticBtn>}
                  {socials?.github && <MagneticBtn href={socials.github} external onClick={() => unlock("CONTACT")}>github →</MagneticBtn>}
                  {socials?.linkedin && <MagneticBtn href={socials.linkedin} external onClick={() => unlock("CONTACT")}>linkedin →</MagneticBtn>}
                  <MagneticBtn href="/account/login">client login →</MagneticBtn>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--text-dim)" }}>
                  // {slug}OS v1.0 · built with Next.js + MongoDB · {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </section>

      <NavDock active={activeSection} light={light} onToggleTheme={toggleTheme} />
    </div>
  );
}
