"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import { setCursorDragging } from "@/lib/cursorBus";

export type PhotoItem = { src: string; caption?: string };
export type VideoItem = { title: string; duration?: string; thumb: string; src: string };

const FALLBACK_PHOTOS: PhotoItem[] = [
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80", caption: "At the desk" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80", caption: "Mid-build" },
  { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80", caption: "Sketching architecture" },
];

const FALLBACK_VIDEOS: VideoItem[] = [
  { title: "A day in my workflow", duration: "1:24", thumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { title: "Why I build for education", duration: "0:52", thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { title: "Quick studio tour", duration: "2:10", thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
];

const FALLBACK_BIO =
  "Outside the editor, I care a lot about how things look and feel — visual design and presentation are as much a part of the process for me as the code underneath. A few short clips below give a closer look at how a build actually comes together.";

const TILTS = [-4, 3, -2];

export default function MeetDeveloper({
  photos = FALLBACK_PHOTOS,
  videos = FALLBACK_VIDEOS,
  bio = FALLBACK_BIO,
}: {
  photos?: PhotoItem[];
  videos?: VideoItem[];
  bio?: string;
}) {
  const [active, setActive] = useState<VideoItem | null>(null);
  const boundsRef = useRef<HTMLDivElement>(null);

  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest text-violet">$ MEET THE DEVELOPER</span>
          <h2 className="font-display text-[clamp(16px,2.4vw,22px)] mt-3 leading-relaxed">More than the code</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center mb-[64px]">
        <Reveal from="left">
          {/* scattered, draggable polaroids — a real, contained drag interaction */}
          <div ref={boundsRef} className="relative grid grid-cols-3 gap-3.5 py-6">
            {photos.map((p, i) => (
              <motion.div
                key={p.caption || i}
                className="win relative aspect-[4/5] cursor-grab"
                style={{ padding: 6, rotate: TILTS[i % TILTS.length] }}
                drag
                dragConstraints={boundsRef as React.RefObject<HTMLDivElement>}
                dragElastic={0.5}
                whileDrag={{ scale: 1.08, zIndex: 20, rotate: 0 }}
                onDragStart={() => setCursorDragging(true)}
                onDragEnd={() => setCursorDragging(false)}
                data-cursor-hover
              >
                <div className="relative overflow-hidden h-[calc(100%-18px)] pointer-events-none">
                  <SafeImage src={p.src} className="w-full h-full object-cover grayscale contrast-125" iconSize={22} />
                </div>
                {p.caption && <div className="text-[10.5px] font-mono text-center pt-1.5 text-mute pointer-events-none">{p.caption}</div>}
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal from="right" delay={80}>
          <p className="text-mute text-[14px] leading-[1.8]">{bio}</p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v, i) => (
          <Reveal key={v.title} delay={i * 90}>
            <div className="win group cursor-pointer" onClick={() => setActive(v)}>
              <div className="win-bar">
                <span className="win-title">CLIP_0{i + 1}.MP4</span>
                <span className="win-controls"><span className="win-dot">▢</span><span className="win-dot">×</span></span>
              </div>
              <div className="relative">
                <SafeImage src={v.thumb} className="w-full h-[160px] object-cover block grayscale contrast-125" iconSize={30} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(10,1,24,0.9) 100%)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-purple transition-transform duration-150 group-hover:scale-110 bg-ink/80">
                  <Play size={16} style={{ color: "#39FF14", fill: "#39FF14" }} className="ml-0.5" />
                </div>
                {v.duration && <span className="absolute bottom-2 right-2 text-[11px] font-mono px-1.5 py-0.5 bg-ink border border-retroBorder">{v.duration}</span>}
                <div className="absolute bottom-2 left-2.5 text-[12.5px] font-mono max-w-[75%] text-paper">{v.title}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-5"
          style={{ background: "rgba(10,1,24,0.9)" }}
          onClick={() => setActive(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="win w-full max-w-[720px]">
            <div className="win-bar">
              <span className="win-title">{active.title}</span>
              <span className="win-controls"><span className="win-dot" onClick={() => setActive(null)}>×</span></span>
            </div>
            <video src={active.src} controls autoPlay className="w-full block bg-black max-h-[65vh]" />
          </div>
        </div>
      )}
    </section>
  );
}
