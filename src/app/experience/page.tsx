import { connectDB } from "@/lib/mongodb";
import ExperienceModel from "@/models/Experience";
import Experience from "@/components/sections/Experience";

async function getExperience() {
  try {
    await connectDB();
    const items = await ExperienceModel.find().sort({ order: 1 }).lean();
    return items.length ? items : undefined;
  } catch {
    return undefined;
  }
}

export default async function ExperiencePage() {
  const items = await getExperience();
  return (
    <div className="pt-10">
      <Experience items={items as any} />
    </div>
  );
}
