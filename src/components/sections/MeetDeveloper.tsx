"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";

const MORE_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80", caption: "At the desk" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80", caption: "Mid-build" },
  { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80", caption: "Sketching architecture" },
];

const VIDEOS = [
  { title: "A day in my workflow", duration: "1:24", thumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { title: "Why I build for education", duration: "0:52", thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { title: "Quick studio tour", duration: "2:10", thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
];

type Video = (typeof VIDEOS)[number];

export default function MeetDeveloper() {
  const [active, setActive] = useState<Video | null>(null);

  return (
    <section className="max-w-[1120px] mx-auto px-7 py-16">
      <Reveal>
        <div className="text-center mb-11">
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>MEET THE DEVELOPER</span>
          <h2 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] mt-2 tracking-tight">More than the code</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center mb-[52px]">
        <Reveal from="left">
          <div className="grid grid-cols-3 gap-3.5">
            {MORE_PHOTOS.map((p) => (
              <div key={p.caption} className="group relative rounded-[10px] overflow-hidden aspect-[4/5]">
                <SafeImage src={p.src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" iconSize={22} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(7,5,11,0.82))" }} />
                <div className="absolute bottom-2 left-2.5 text-[11.5px]">{p.caption}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal from="right" delay={80}>
          <p className="text-mute text-[15px] leading-[1.75]">
            Outside the editor, I care a lot about how things look and feel — visual design and
            presentation are as much a part of the process for me as the code underneath. A few
            short clips below give a closer look at how a build actually comes together.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIDEOS.map((v, i) => (
          <Reveal key={v.title} delay={i * 90}>
            <div
              className="group hover-card relative rounded-xl overflow-hidden cursor-pointer bg-ink2"
              style={{ border: "1px solid rgba(243,240,247,0.09)" }}
              onClick={() => setActive(v)}
            >
              <SafeImage src={v.thumb} className="w-full h-[170px] object-cover block" iconSize={30} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,5,11,0.88) 100%)" }} />
              <div
                className="animate-ambientGlow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.15]"
                style={{ background: "rgba(139,47,224,0.136)", border: "1px solid rgba(180,92,255,0.272)" }}
              >
                <Play size={17} className="text-paper fill-paper ml-0.5" />
              </div>
              <span className="absolute bottom-2.5 right-2.5 text-[11px] font-mono px-1.5 py-1 rounded" style={{ background: "rgba(7,5,11,0.55)" }}>{v.duration}</span>
              <div className="absolute bottom-2.5 left-3 text-[13.5px] font-semibold max-w-[70%]">{v.title}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="text-center text-mute text-xs mt-[18px]">Placeholder clips — swap in your own footage.</p>

      {active && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-5"
          style={{ background: "rgba(7,5,11,0.8)", backdropFilter: "blur(6px)" }}
          onClick={() => setActive(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[720px] rounded-2xl overflow-hidden bg-ink2" style={{ border: "1px solid rgba(180,92,255,0.136)" }}>
            <video src={active.src} controls autoPlay className="w-full block bg-black max-h-[70vh]" />
            <div className="flex justify-between items-center gap-3 p-5">
              <div>
                <div className="font-semibold text-[14.5px]">{active.title}</div>
                <div className="text-xs text-mute mt-0.5">Placeholder clip — swap in real footage</div>
              </div>
              <button onClick={() => setActive(null)} className="icon-hover w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ border: "1px solid rgba(243,240,247,0.14)" }}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
