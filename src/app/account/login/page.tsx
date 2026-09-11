import { getSiteSettings } from "@/lib/settings";
import RetroAccountLogin from "@/components/retro/RetroAccountLogin";

export default async function AccountLoginPage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroAccountLogin osName={osName} />;
}
