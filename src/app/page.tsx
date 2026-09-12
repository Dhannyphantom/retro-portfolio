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
// no DB configured), each section quietly renders empty instead of crashing
// the page. Run `npm run seed` once to populate real starter content —
// everything you see on the site is then DB-backed and editable at
// /admin/content (and the equivalent per-section admin pages).
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
    const data = {
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
    };
    // `.lean()` documents still carry non-plain values (ObjectId, Buffer,
    // Date) that Next.js refuses to hand to a Client Component (RetroHome
    // is "use client"). Round-tripping through JSON strips all of that down
    // to plain strings/numbers, same as the JSON.parse(JSON.stringify(...))
    // pattern already used elsewhere in the app (e.g. booking pages).
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.warn(
      "DB not reachable yet — rendering with no content until it is.",
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
      headlines={
        settings?.heroHeadlines?.length
          ? settings.heroHeadlines
          : ["Software Developer"]
      }
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
      projects={projects as any}
      experience={experience as any}
      services={services as any}
      rateCards={rateCards as any}
      testimonials={testimonials as any}
      faqs={faqs as any}
      techstack={techstack as any}
      stats={stats as any}
      workflowSteps={workflowSteps as any}
      philosophyLines={philosophyLines.map((p: any) => p.text)}
      photos={photos as any}
      videos={videos as any}
    />
  );
}
