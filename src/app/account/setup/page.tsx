import { getSiteSettings } from "@/lib/settings";
import RetroAccountSetup from "@/components/retro/RetroAccountSetup";

export default async function AccountSetupPage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroAccountSetup osName={osName} />;
}
