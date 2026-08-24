import { Smartphone, Globe, Server } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  { icon: Smartphone, title: "Mobile Development", desc: "React Native apps built for real users — leaderboards, wallets, media playback, offline-safe reading." },
  { icon: Globe, title: "Web Development", desc: "Next.js sites with motion, structure and copy that actually earns the visitor's attention." },
  { icon: Server, title: "Backend & APIs", desc: "Node.js and MongoDB systems built to stay boring under real traffic." },
];

export default function About({ bio }: { bio?: string }) {
  return (
    <section id="about" className="relative max-w-[1120px] mx-auto px-7 pt-16 pb-5 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div>
        {SERVICES.map((s, i) => (
          <div key={s.title} className={`flex gap-[18px] py-[22px] ${i !== 0 ? "border-t border-white/[0.07]" : ""}`}>
            <div className="w-0.5 flex-shrink-0 bg-gradient-to-b from-violet to-purple" style={{ height: 40 }} />
            <div className="icon-hover w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-violet" style={{ border: "1px solid rgba(180,92,255,0.122)", background: "rgba(139,47,224,0.034)" }}>
              <s.icon size={17} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-[16.5px] mb-1.5">{s.title}</h4>
              <p className="text-mute text-[13.5px] leading-relaxed max-w-[300px]">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Reveal from="right">
          <div className="flex items-center gap-2.5 mb-[18px]">
            <div className="w-0.5 h-[22px] bg-violet" />
            <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.422)" }}>INTRODUCE</span>
          </div>
          <h2 className="font-display font-semibold text-[clamp(26px,3vw,34px)] mb-[18px] tracking-tight">About me</h2>
          <p className="text-mute text-[15px] leading-[1.75] max-w-[440px]">
            {bio ||
              "I started building software to solve problems in front of me — a quiz app for a community, a reading app that needed better notes. That habit turned into a full-stack practice across mobile, web and backend, always aimed at software that holds up once real people start using it."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
