"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// A custom, chrome-free video player styled like an old desktop media
// player (Windows 95 / early QuickTime era) — a bordered "window" with a
// title bar, the video itself with NO native browser controls, and a
// bespoke transport bar (play/pause, scrubber, elapsed/total time, mute)
// built from plain buttons and divs so it matches the rest of the retro UI.
// Fallback colors are hardcoded (not just CSS vars) so this renders
// correctly whether it's opened from the new retro-root pages or the
// legacy (non-retro) theme.
export type RetroVideoPlayerProps = {
  title: string;
  src: string;
  poster?: string;
  onClose: () => void;
};

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RetroVideoPlayer({ title, src, poster, onClose }: RetroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onLoaded = () => setDuration(v.duration || 0);
    const onEnded = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    // Autoplay as soon as the player opens, same as the old native-controls
    // modal used to (autoPlay attribute) — muted-safe browsers may still
    // block this, which is fine, the big play button is right there.
    videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
    setCurrent(v.currentTime);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const g = "#39FF14";
  const border = "#2a2a2a";
  const dim = "#888888";
  const bg = "#080808";

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, background: bg, border: `2px solid ${border}` }}
      >
        {/* window title bar, matching the OS-chrome look used everywhere else */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 12px", background: "#111111", borderBottom: `1px solid ${border}`,
            fontFamily: "monospace", fontSize: 11, color: dim, letterSpacing: "0.04em",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title.toUpperCase()} — MEDIAPLAYER.EXE
          </span>
          <span
            onClick={onClose}
            data-cursor-hover
            style={{ cursor: "pointer", border: `1px solid ${border}`, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}
          >
            ×
          </span>
        </div>

        {/* video surface — no native controls, click-to-toggle, with a big
            play button overlay whenever it's paused */}
        <div style={{ position: "relative", background: "#000", cursor: "pointer" }} onClick={toggle} data-cursor-hover>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            style={{ width: "100%", display: "block", maxHeight: "62vh", background: "#000" }}
          />
          {!playing && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
              <div style={{ width: 58, height: 58, border: `2px solid ${g}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}>
                <Play size={22} color={g} fill={g} style={{ marginLeft: 3 }} />
              </div>
            </div>
          )}
        </div>

        {/* custom transport bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderTop: `1px solid ${border}` }}>
          <button
            onClick={toggle}
            data-cursor-hover
            style={{ width: 28, height: 28, flexShrink: 0, background: "none", border: `1px solid ${border}`, color: g, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <span style={{ fontFamily: "monospace", fontSize: 10, color: dim, minWidth: 34, flexShrink: 0 }}>{formatTime(current)}</span>

          <div
            onClick={seek}
            data-cursor-hover
            style={{ flex: 1, height: 6, background: "#1a1a1a", border: `1px solid ${border}`, position: "relative", cursor: "pointer" }}
          >
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${duration ? (current / duration) * 100 : 0}%`, background: g }} />
          </div>

          <span style={{ fontFamily: "monospace", fontSize: 10, color: dim, minWidth: 34, textAlign: "right", flexShrink: 0 }}>{formatTime(duration)}</span>

          <button
            onClick={toggleMute}
            data-cursor-hover
            style={{ width: 28, height: 28, flexShrink: 0, background: "none", border: `1px solid ${border}`, color: dim, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
