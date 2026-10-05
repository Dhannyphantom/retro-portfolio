import { getSiteSettings } from "@/lib/settings";
import RetroHirePage from "@/components/retro/RetroHirePage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Hire Me — Start a Project",
    description: "Submit a project brief for a mobile app, web app or backend build and get a response within a day or two.",
    path: "/hire",
  });
}

export default async function HirePage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroHirePage osName={osName} />;
}
