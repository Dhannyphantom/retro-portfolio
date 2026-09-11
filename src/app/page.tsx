import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import RateCard from "@/models/RateCard";
import Testimonial from "@/models/Testimonial";
import FAQModel from "@/models/FAQ";
import SiteSettings from "@/models/SiteSettings";
import TechStack from "@/models/TechStack";
import Stat from "@/models/Stat";
import WorkflowStep from "@/models/WorkflowStep";
import PhilosophyLine from "@/models/PhilosophyLine";
import Photo from "@/models/Photo";
import ProjectVideo from "@/models/ProjectVideo";

import RetroHome from "@/components/retro/RetroHome";

// Every fetch degrades gracefully: if MONGODB_URI isn't set yet (fresh clone,
// no DB configured), each section quietly falls back to its own demo data
// instead of crashing the page. Once you add MONGODB_URI and run `npm run seed`,
// every section on this page starts reading from the database and becomes
// editable at /admin/content.
async function getData() {
  try {
    await connectDB();
    const [
      projects,
      experience,
      services,
      rateCards,
      testimonials,
      faqs,
      settings,
      techstack,
      stats,
      workflowSteps,
      philosophyLines,
      photos,
      videos,
    ] = await Promise.all([
      Project.find().sort({ order: 1 }).lean(),
      Experience.find().sort({ order: 1 }).lean(),
      Service.find().sort({ order: 1 }).lean(),
      RateCard.find().sort({ order: 1 }).lean(),
      Testimonial.find({ approved: true }).sort({ order: 1 }).lean(),
      FAQModel.find().sort({ order: 1 }).lean(),
      SiteSettings.findOne({ key: "main" }).lean(),
      TechStack.find().sort({ order: 1 }).lean(),
      Stat.find().sort({ order: 1 }).lean(),
      WorkflowStep.find().sort({ order: 1 }).lean(),
      PhilosophyLine.find().sort({ order: 1 }).lean(),
      Photo.find().sort({ order: 1 }).lean(),
      ProjectVideo.find().sort({ order: 1 }).lean(),
    ]);
    // Mongoose `.lean()` documents still carry non-plain fields (ObjectId,
    // Date, etc. — objects with a `toJSON` method) which Next.js refuses to
    // pass from a Server Component into a Client Component ("Only plain
    // objects can be passed..."). Testimonial in particular has `_id` and a
    // `bookingId` ObjectId ref, which is what triggered the warning/error.
    // Round-tripping through JSON strips all of that down to plain
    // strings/numbers, the same way `JSON.parse(JSON.stringify(...))` is
    // already used elsewhere in this app (e.g. booking pages) for the same
    // reason.
    return JSON.parse(
      JSON.stringify({
        projects,
        experience,
        services,
        rateCards,
        testimonials,
        faqs,
        settings,
        techstack,
        stats,
        workflowSteps,
        philosophyLines,
        photos,
        videos,
      }),
    );
  } catch (err) {
    console.warn(
      "DB not reachable yet — rendering with fallback demo content.",
      err,
    );
    return {
      projects: [] as any[],
      experience: [] as any[],
      services: [] as any[],
      rateCards: [] as any[],
      testimonials: [] as any[],
      faqs: [] as any[],
      settings: null as any,
      techstack: [] as any[],
      stats: [] as any[],
      workflowSteps: [] as any[],
      philosophyLines: [] as any[],
      photos: [] as any[],
      videos: [] as any[],
    };
  }
}

export default async function HomePage() {
  const {
    projects,
    experience,
    services,
    rateCards,
    testimonials,
    faqs,
    settings,
    techstack,
    stats,
    workflowSteps,
    philosophyLines,
    photos,
    videos,
  } = await getData();

  return (
    <RetroHome
      name={settings?.name || "Daniel Olojo"}
      headline={settings?.heroHeadline || "Software Developer"}
      bio={
        settings?.bio ||
        "Software developer building mobile, web and backend products that hold up under real use."
      }
      meetDeveloperBio={settings?.meetDeveloperBio}
      email={settings?.email}
      location={settings?.location}
      availability={settings?.availability ?? true}
      socials={settings?.socials}
      cvUrl={settings?.cvUrl}
      cvEnabled={settings?.cvEnabled}
      projects={(projects.length ? projects : FALLBACK_PROJECTS) as any}
      experience={(experience.length ? experience : FALLBACK_EXPERIENCE) as any}
      services={(services.length ? services : FALLBACK_SERVICES) as any}
      rateCards={(rateCards.length ? rateCards : FALLBACK_RATECARDS) as any}
      testimonials={testimonials as any}
      faqs={(faqs.length ? faqs : FALLBACK_FAQS) as any}
      techstack={techstack as any}
      stats={stats as any}
      workflowSteps={workflowSteps as any}
      philosophyLines={
        philosophyLines.length
          ? philosophyLines.map((p: any) => p.text)
          : FALLBACK_PHILOSOPHY
      }
      photos={photos as any}
      videos={videos as any}
    />
  );
}

// Fallback demo content — only used when the DB has no rows yet, so the
// homepage never looks empty on a fresh clone.
const FALLBACK_PROJECTS = [
  {
    title: "Monthly Quiz Competition",
    slug: "monthly-quiz-competition",
    category: "Mobile",
    description:
      "A live monthly quiz competition inside a mobile app — paginated leaderboards, celebratory winner cards, and automatic wallet crediting.",
    technologies: ["React Native", "Node.js", "MongoDB"],
    thumbnail:
      "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    title: "Gospel Network Global",
    slug: "gospel-network-global",
    category: "Mobile",
    description:
      "A podcast player rebuilt around full-bleed artwork, a frosted glass control panel, and gesture-driven playback.",
    technologies: ["React Native", "Redux", "Audio Pro"],
    thumbnail:
      "https://images.unsplash.com/photo-1548094891-c4ba474efd16?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Gospel Network — Scripture",
    slug: "gospel-network-scripture",
    category: "Mobile",
    description:
      "A scripture reading app with a three-step verse-grid navigator and synced notes.",
    technologies: ["React Native", "Context API"],
    thumbnail:
      "https://images.unsplash.com/photo-1551651653-c5186a1fbba2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Dextrous — Filmmaker Site",
    slug: "dextrous-filmmaker-site",
    category: "Web",
    description:
      "A cinematic portfolio for a filmmaker brand with GSAP transitions and scroll-triggered reveals.",
    technologies: ["Next.js", "TypeScript", "GSAP"],
    thumbnail:
      "https://images.unsplash.com/photo-1642132652798-ae887edb9e9d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Exam Bank Pipeline",
    slug: "exam-bank-pipeline",
    category: "Backend",
    description:
      "A batch pipeline turning raw DOCX question banks into schema-validated JSON.",
    technologies: ["Node.js", "JSON Schema"],
    thumbnail:
      "https://images.unsplash.com/photo-1697292859724-0d2501966448?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI Proxy Layer",
    slug: "ai-proxy-layer",
    category: "Backend",
    description:
      "A provider-agnostic AI proxy migrated live from Anthropic to Gemini.",
    technologies: ["Next.js API", "Gemini 2.5"],
    thumbnail:
      "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=80",
  },
];

const FALLBACK_EXPERIENCE = [
  {
    role: "Software Developer",
    organization: "Guru EduTech",
    startDate: "2023",
    endDate: "Present",
    description:
      "Building mobile apps, an exam-prep content pipeline, and the backend behind a monthly quiz competition.",
    technologies: ["React Native", "Node.js", "MongoDB", "Next.js"],
  },
  {
    role: "Full-Stack Developer",
    organization: "Freelance",
    startDate: "2021",
    endDate: "2023",
    description: "Shipped web and mobile products for independent clients.",
    technologies: ["React", "Next.js", "Express"],
  },
  {
    role: "Self-Taught Foundations",
    organization: "Independent Study",
    startDate: "2019",
    endDate: "2021",
    description: "Learned JavaScript, React and React Native by building.",
    technologies: ["JavaScript", "React", "React Native"],
  },
];

const FALLBACK_SERVICES = [
  {
    title: "Mobile Development",
    description: "React Native apps built for real users.",
    icon: "Smartphone",
  },
  {
    title: "Web Development",
    description:
      "Next.js sites with motion, structure and copy that earns attention.",
    icon: "Globe",
  },
  {
    title: "Backend & APIs",
    description:
      "Node.js and MongoDB systems built to stay boring under real traffic.",
    icon: "Server",
  },
  {
    title: "MVP Development",
    description: "Ship a working product fast.",
    icon: "Rocket",
  },
  {
    title: "Performance Optimization",
    description: "Faster loads, leaner bundles, fewer re-renders.",
    icon: "Zap",
  },
  {
    title: "Maintenance & Scaling",
    description: "Keeping shipped products healthy as usage grows.",
    icon: "Wrench",
  },
];

const FALLBACK_RATECARDS = [
  {
    name: "Hourly",
    billingType: "hourly",
    price: "$35",
    unit: "/ hour",
    description: "For focused, well-scoped work.",
    features: ["Flexible engagement", "Weekly time logs"],
  },
  {
    name: "Project-Based",
    billingType: "project",
    price: "$1,200",
    unit: "starting at",
    description: "For a defined product or feature set.",
    features: ["Fixed scope & timeline", "30 days post-launch support"],
    recommended: true,
  },
  {
    name: "Monthly Retainer",
    billingType: "retainer",
    price: "$800",
    unit: "/ month",
    description: "For ongoing product partnership.",
    features: ["Priority response time", "Cancel anytime"],
  },
];

const FALLBACK_FAQS = [
  {
    question: "What technologies do you use?",
    answer:
      "React Native, Next.js, Node.js and MongoDB, with TypeScript throughout.",
  },
  {
    question: "Do you work with startups?",
    answer: "Yes — early-stage products are a lot of what I build.",
  },
  {
    question: "Do you work remotely?",
    answer: "Yes, fully remote, async-friendly across time zones.",
  },
];

const FALLBACK_PHILOSOPHY = [
  "Build things that matter.",
  "Keep it simple.",
  "Engineer for scale.",
  "Performance is a feature.",
  "Great software feels invisible.",
];
