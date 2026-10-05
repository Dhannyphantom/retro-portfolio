import { getSiteSettings } from "@/lib/settings";
import RetroContactPage from "@/components/retro/RetroContactPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildPageMetadata, getSiteUrl } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Contact",
    description: "Get in touch about a new project or collaboration. Remote and open worldwide.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl("/contact"),
    name: `Contact ${settings.name}`,
    about: { "@id": `${getSiteUrl()}/#person` },
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <RetroContactPage osName={osName} email={settings.email} location={settings.location} socials={settings.socials} />
    </>
  );
}
