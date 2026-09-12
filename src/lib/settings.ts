import { connectDB } from "./mongodb";
import SiteSettings from "@/models/SiteSettings";

export type SiteSettingsData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  availability: boolean;
  socials: { github?: string; linkedin?: string; twitter?: string };
  cvUrl?: string;
  cvEnabled?: boolean;
  avatarUrl?: string;
  heroHeadlines: string[];
  meetDeveloperBio?: string;
};

const DEFAULTS: SiteSettingsData = {
  name: "Daniel Olojo",
  title: "Software Developer",
  bio: "Software developer building mobile, web and backend products that hold up under real use.",
  email: "",
  location: "Remote — open worldwide",
  availability: true,
  socials: {},
  cvEnabled: true,
  avatarUrl: "",
  heroHeadlines: ["Software Developer"],
};

// Shared by the root layout (nav, footer, page metadata) and the homepage —
// one DB round trip's worth of profile data, reused everywhere it needs to
// show up. Falls back to sane defaults if the DB isn't reachable yet.
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key: "main" }).lean();
    if (!doc) return DEFAULTS;
    return { ...DEFAULTS, ...(doc as unknown as Partial<SiteSettingsData>) };
  } catch {
    return DEFAULTS;
  }
}
