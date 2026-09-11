import { getSiteSettings } from "@/lib/settings";
import RetroContactPage from "@/components/retro/RetroContactPage";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroContactPage osName={osName} email={settings.email} location={settings.location} socials={settings.socials} />;
}
