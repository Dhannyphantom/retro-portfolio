import JsonLd from "./JsonLd";
import { homeGraph } from "@/lib/seo";
import type { SiteSettingsData } from "@/lib/settings";

export default function HomeJsonLd({ settings, skills }: { settings: Partial<SiteSettingsData> | null; skills: string[] }) {
  const s = {
    name: "Daniel Olojo",
    title: "Software Developer",
    bio: "",
    email: "",
    location: "",
    availability: true,
    socials: {},
    heroHeadlines: [],
    ...(settings || {}),
  } as SiteSettingsData;
  return <JsonLd data={homeGraph(s, skills)} />;
}
