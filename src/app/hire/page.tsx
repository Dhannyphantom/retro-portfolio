import { getSiteSettings } from "@/lib/settings";
import RetroHirePage from "@/components/retro/RetroHirePage";

export default async function HirePage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroHirePage osName={osName} />;
}
