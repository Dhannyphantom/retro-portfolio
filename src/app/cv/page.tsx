import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import RetroCvPage from "@/components/retro/RetroCvPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Resume / CV",
    description: "Download the current CV: software developer working across mobile, web and backend.",
    path: "/cv",
  });
}

async function getSettings(): Promise<any> {
  try {
    await connectDB();
    return await SiteSettings.findOne({ key: "main" }).lean();
  } catch {
    return null;
  }
}

export default async function CVPage() {
  const settings = await getSettings();
  const osName = `${(settings?.name || "Daniel Olojo").split(" ")[0].toLowerCase()}OS`;
  return (
    <RetroCvPage
      osName={osName}
      name={settings?.name || "Daniel Olojo"}
      title={settings?.title || "Software Developer"}
      enabled={settings?.cvEnabled ?? true}
      url={settings?.cvUrl || ""}
    />
  );
}
