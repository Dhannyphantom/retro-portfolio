import { getSiteSettings } from "@/lib/settings";
import RetroProjectsArchive from "@/components/retro/RetroProjectsArchive";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Projects",
    description: "Mobile, web and backend projects shipped with React Native, Next.js, Node.js and MongoDB, with case studies for each.",
    path: "/projects",
  });
}

export default async function ProjectsArchivePage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroProjectsArchive osName={osName} />;
}
