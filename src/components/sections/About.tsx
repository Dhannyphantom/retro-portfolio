import { Smartphone, Globe, Server } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Terminal from "@/components/sections/Terminal";

const SERVICES = [
  { icon: Smartphone, title: "Mobile Development", desc: "React Native apps built for real users — leaderboards, wallets, media playback, offline-safe reading." },
  { icon: Globe, title: "Web Development", desc: "Next.js sites with motion, structure and copy that actually earns the visitor's attention." },
  { icon: Server, title: "Backend & APIs", desc: "Node.js and MongoDB systems built to stay boring under real traffic." },
];

export default function About({ bio, name }: { bio?: string; name?: string }) {
  return (
    <section id="about" className="relative max-w-[1120px] mx-auto px-7 pt-16 pb-5 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div>
        {SERVICES.map((s, i) => (
          <div key={s.title} className={`flex gap-[18px] py-[22px] ${i !== 0 ? "border-t border-white/[0.07]" : ""}`}>
            <div className="w-0.5 flex-shrink-0 bg-gradient-to-b from-violet to-purple" style={{ height: 40 }} />
            <div className="icon-hover w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-violet" style={{ border: "1px solid rgba(0,229,255,0.122)", background: "rgba(57,255,20,0.034)" }}>
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
            <span className="font-mono text-xs tracking-widest text-violet">$ INTRODUCE</span>
          </div>
          <h2 className="font-display font-semibold text-[clamp(15px,2vw,19px)] mb-[18px] tracking-tight leading-relaxed">About me</h2>
          <p className="text-mute text-[13px] leading-[1.7] max-w-[440px] mb-4">
            Don&apos;t just take my word for it — the terminal below actually runs. Type <code className="text-violet">help</code> to
            poke around (and keep an eye out for hidden commands).
          </p>
          <Terminal name={name} bio={bio} />
        </Reveal>
      </div>
    </section>
  );
}
