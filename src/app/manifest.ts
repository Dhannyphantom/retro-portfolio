import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";

// Served at /manifest.webmanifest.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings();
  return {
    name: `${s.name} — ${s.title}`,
    short_name: s.name.split(" ")[0],
    description: s.bio,
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
