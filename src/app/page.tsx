import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import RateCard from "@/models/RateCard";
import Testimonial from "@/models/Testimonial";
import FAQModel from "@/models/FAQ";
import SiteSettings from "@/models/SiteSettings";

import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import DevStats from "@/components/sections/DevStats";
import ExperienceSection from "@/components/sections/Experience";
import ProjectsSection from "@/components/sections/Projects";
import ServicesSection from "@/components/sections/Services";
import HowIWork from "@/components/sections/HowIWork";
import RateCardsSection from "@/components/sections/RateCards";
import TestimonialsSection from "@/components/sections/Testimonials";
import MeetDeveloper from "@/components/sections/MeetDeveloper";
import Philosophy from "@/components/sections/Philosophy";
import FAQSection from "@/components/sections/FAQ";
import BigCTA from "@/components/sections/BigCTA";
import Contact from "@/components/sections/Contact";

// Every fetch degrades gracefully: if MONGODB_URI isn't set yet (fresh clone,
// no DB configured), each section quietly falls back to its own demo data
// instead of crashing the page. Once you add MONGODB_URI and run `npm run seed`,
// everything here starts reading from the database automatically.
async function getData(): Promise<{
  projects: any[];
  experience: any[];
  services: any[];
  rateCards: any[];
  testimonials: any[];
  faqs: any[];
  settings: any;
}> {
  try {
    await connectDB();
    const [projects, experience, services, rateCards, testimonials, faqs, settings] = await Promise.all([
      Project.find().sort({ order: 1 }).lean(),
      Experience.find().sort({ order: 1 }).lean(),
      Service.find().sort({ order: 1 }).lean(),
      RateCard.find().sort({ order: 1 }).lean(),
      Testimonial.find({ approved: true }).sort({ order: 1 }).lean(),
      FAQModel.find().sort({ order: 1 }).lean(),
      SiteSettings.findOne({ key: "main" }).lean(),
    ]);
    return { projects, experience, services, rateCards, testimonials, faqs, settings };
  } catch (err) {
    console.warn("DB not reachable yet — rendering with fallback demo content.", err);
    return { projects: [], experience: [], services: [], rateCards: [], testimonials: [], faqs: [], settings: null };
  }
}

export default async function HomePage() {
  const { projects, experience, services, rateCards, testimonials, faqs, settings } = await getData();

  return (
    <>
      <Hero name={settings?.name?.split(" ")[0] || "Daniel"} headline={settings?.heroHeadline || "Software Developer"} />
      <Marquee />
      <About bio={settings?.bio} />
      <DevStats />
      <ExperienceSection items={experience.length ? (experience as any) : undefined} />
      <ProjectsSection items={projects.length ? (projects as any) : FALLBACK_PROJECTS} limit={6} />
      <ServicesSection items={services.length ? (services as any) : undefined} />
      <HowIWork />
      <RateCardsSection items={rateCards.length ? (rateCards as any) : undefined} />
      <TestimonialsSection items={testimonials.length ? (testimonials as any) : undefined} />
      <MeetDeveloper />
      <Philosophy />
      <FAQSection items={faqs.length ? (faqs as any) : undefined} />
      <BigCTA />
      <Contact />
    </>
  );
}

// Used only when the DB has no projects yet, so the homepage never looks empty.
const FALLBACK_PROJECTS = [
  { title: "Monthly Quiz Competition", slug: "monthly-quiz-competition", category: "Mobile", description: "A live monthly quiz competition inside a mobile app — paginated leaderboards, celebratory winner cards, and automatic wallet crediting.", technologies: ["React Native", "Node.js", "MongoDB"], thumbnail: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=80" },
  { title: "Gospel Network Global", slug: "gospel-network-global", category: "Mobile", description: "A podcast player rebuilt around full-bleed artwork, a frosted glass control panel, and gesture-driven playback.", technologies: ["React Native", "Redux", "Audio Pro"], thumbnail: "https://images.unsplash.com/photo-1548094891-c4ba474efd16?auto=format&fit=crop&w=800&q=80" },
  { title: "Gospel Network — Scripture", slug: "gospel-network-scripture", category: "Mobile", description: "A scripture reading app with a three-step verse-grid navigator and synced notes.", technologies: ["React Native", "Context API"], thumbnail: "https://images.unsplash.com/photo-1551651653-c5186a1fbba2?auto=format&fit=crop&w=800&q=80" },
  { title: "Dextrous — Filmmaker Site", slug: "dextrous-filmmaker-site", category: "Web", description: "A cinematic portfolio for a filmmaker brand with GSAP transitions and scroll-triggered reveals.", technologies: ["Next.js", "TypeScript", "GSAP"], thumbnail: "https://images.unsplash.com/photo-1642132652798-ae887edb9e9d?auto=format&fit=crop&w=800&q=80" },
  { title: "Exam Bank Pipeline", slug: "exam-bank-pipeline", category: "Backend", description: "A batch pipeline turning raw DOCX question banks into schema-validated JSON.", technologies: ["Node.js", "JSON Schema"], thumbnail: "https://images.unsplash.com/photo-1697292859724-0d2501966448?auto=format&fit=crop&w=800&q=80" },
  { title: "AI Proxy Layer", slug: "ai-proxy-layer", category: "Backend", description: "A provider-agnostic AI proxy migrated live from Anthropic to Gemini.", technologies: ["Next.js API", "Gemini 2.5"], thumbnail: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=80" },
];
