"use client";
import { useState, MouseEvent } from "react";
import Link from "next/link";
import { Github, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CTAButton from "@/components/ui/CTAButton";
import DiagonalCard from "@/components/ui/DiagonalCard";
import SafeImage from "@/components/ui/SafeImage";
import type { ProjectItem } from "@/types";

function ProjectImage({ src, title }: { src?: string; title: string }) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({ transform: `perspective(900px) rotateX(${(py - 0.5) * -8}deg) rotateY(${(px - 0.5) * 8}deg) scale(1.03)` });
    setSpot({ x: px * 100, y: py * 100 });
  };

  return (
    <DiagonalCard always padding={0} title={`${title.toUpperCase().replace(/\s+/g, "_")}.APP`}>
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)" })}
        className="relative transition-transform duration-[400ms]"
        style={{ transformStyle: "preserve-3d", ...style }}
      >
        <SafeImage src={src} className="w-full h-[280px] object-cover block grayscale contrast-125" iconSize={34} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, rgba(0,229,255,0.102), transparent 65%)` }}
        />
      </div>
    </DiagonalCard>
  );
}

function ProjectRow({ p, i }: { p: ProjectItem; i: number }) {
  const reversed = i % 2 === 1;
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-11 ${i !== 0 ? "border-t border-white/[0.07]" : ""}`}>
      <Reveal from={reversed ? "right" : "left"} className={reversed ? "md:order-2" : "md:order-1"}>
        <h3 className="font-display font-semibold text-[15px] mb-3.5 tracking-tight leading-relaxed">{p.title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {p.technologies.map((t) => (
            <DiagonalCard key={t} always radius={6} padding={1} className="inline-block">
              <span className="block text-[11.5px] font-mono px-2.5 py-1.5" style={{ color: "rgba(0,229,255,0.422)", background: "rgba(57,255,20,0.027)" }}>{t}</span>
            </DiagonalCard>
          ))}
        </div>
        <p className="text-mute text-[14.5px] leading-relaxed mb-6 max-w-[440px]">{p.description}</p>
        <div className="flex gap-2.5">
          {p.githubUrl && (
            <CTAButton variant="primary" href={p.githubUrl} className="px-[18px] py-2.5 text-[13px]">
              <Github size={14} /> View GitHub
            </CTAButton>
          )}
          <CTAButton variant="outline" href={`/projects/${p.slug}`} className="px-[18px] py-2.5 text-[13px]">
            View project <ArrowUpRight size={14} />
          </CTAButton>
        </div>
      </Reveal>
      <Reveal from={reversed ? "left" : "right"} delay={80} className={reversed ? "md:order-1" : "md:order-2"}>
        <ProjectImage src={p.thumbnail} title={p.title} />
      </Reveal>
    </div>
  );
}

export default function Projects({ items, limit }: { items: ProjectItem[]; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <section id="work" className="relative max-w-[1120px] mx-auto px-7 pt-12 pb-[60px]">
      <Reveal>
        <div className="text-center mb-2.5">
          <span className="font-mono text-xs tracking-widest text-violet">$ SELECTED WORK</span>
          <h2 className="font-display font-semibold text-[clamp(16px,2.2vw,22px)] mt-3 tracking-tight leading-relaxed">Projects</h2>
        </div>
      </Reveal>
      <div>
        {list.map((p, i) => <ProjectRow key={p.slug} p={p} i={i} />)}
      </div>
      {limit && items.length > limit && (
        <div className="text-center mt-8">
          <CTAButton variant="outline" href="/projects">View all projects <ArrowUpRight size={14} /></CTAButton>
        </div>
      )}
    </section>
  );
}
