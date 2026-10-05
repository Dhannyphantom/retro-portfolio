import { connectDB } from "@/lib/mongodb";
import ExperienceModel from "@/models/Experience";
import { getSiteSettings } from "@/lib/settings";
import RetroExperiencePage from "@/components/retro/RetroExperiencePage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Experience",
    description: "Professional experience building mobile apps, web platforms and backend systems.",
    path: "/experience",
  });
}

async function getExperience() {
  try {
    await connectDB();
    return await ExperienceModel.find().sort({ order: 1 }).lean();
  } catch {
    return [];
  }
}

export default async function ExperiencePage() {
  const [items, settings] = await Promise.all([getExperience(), getSiteSettings()]);
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroExperiencePage osName={osName} experience={items as any} />;
}
