import { getSiteSettings } from "@/lib/settings";
import RetroProjectsArchive from "@/components/retro/RetroProjectsArchive";

export default async function ProjectsArchivePage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroProjectsArchive osName={osName} />;
}
