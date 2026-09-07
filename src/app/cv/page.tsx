import { Download } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import CTAButton from "@/components/ui/CTAButton";

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
  const enabled = settings?.cvEnabled ?? true;
  const url = settings?.cvUrl || "";

  return (
    <div className="max-w-[700px] mx-auto px-7 pt-24 pb-32 text-center">
      <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,229,255,0.422)" }}>RESUME</span>
      <h1 className="font-display text-[clamp(15px,2.2vw,19px)] tracking-tight mt-4 mb-5 leading-relaxed">
        {settings?.name || "Daniel Olojo"}
      </h1>
      <p className="text-mute text-[15px] leading-relaxed mb-8">
        {settings?.title || "Software Developer"} — mobile, web and backend. Download the current CV below.
      </p>
      {enabled && url ? (
        <CTAButton variant="primary" href={url}><Download size={15} /> Download CV</CTAButton>
      ) : (
        <p className="text-mute text-sm">
          No CV has been uploaded yet — add one from <code>/admin/profile</code>.
        </p>
      )}
    </div>
  );
}
