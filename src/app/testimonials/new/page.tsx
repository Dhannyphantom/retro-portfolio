import { getSiteSettings } from "@/lib/settings";
import RetroTestimonialForm from "@/components/retro/RetroTestimonialForm";

export default async function NewTestimonialPage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroTestimonialForm osName={osName} />;
}
