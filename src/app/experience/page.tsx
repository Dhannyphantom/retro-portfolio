import { connectDB } from "@/lib/mongodb";
import ExperienceModel from "@/models/Experience";
import { getSiteSettings } from "@/lib/settings";
import RetroExperiencePage from "@/components/retro/RetroExperiencePage";

const FALLBACK: any[] = [
  { role: "Software Developer", organization: "Guru EduTech", startDate: "2023", endDate: "Present", description: "Building mobile apps, an exam-prep content pipeline, and the backend behind a monthly quiz competition.", technologies: ["React Native", "Node.js", "MongoDB", "Next.js"] },
  { role: "Full-Stack Developer", organization: "Freelance", startDate: "2021", endDate: "2023", description: "Shipped web and mobile products for independent clients.", technologies: ["React", "Next.js", "Express"] },
  { role: "Self-Taught Foundations", organization: "Independent Study", startDate: "2019", endDate: "2021", description: "Learned JavaScript, React and React Native by building.", technologies: ["JavaScript", "React", "React Native"] },
];

async function getExperience() {
  try {
    await connectDB();
    const items = await ExperienceModel.find().sort({ order: 1 }).lean();
    return items.length ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function ExperiencePage() {
  const [items, settings] = await Promise.all([getExperience(), getSiteSettings()]);
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroExperiencePage osName={osName} experience={items as any} />;
}
