import { connectDB } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import RateCardModel from "@/models/RateCard";
import WorkflowStepModel from "@/models/WorkflowStep";
import { getSiteSettings } from "@/lib/settings";
import RetroServicesPage from "@/components/retro/RetroServicesPage";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata, getSiteUrl, absoluteUrl } from "@/lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Services & Rates",
    description: "Mobile app, web and backend development services with transparent hourly, project and retainer pricing.",
    path: "/services",
  });
}

async function getData() {
  try {
    await connectDB();
    const [services, rateCards, workflowSteps] = await Promise.all([
      ServiceModel.find().sort({ order: 1 }).lean(),
      RateCardModel.find().sort({ order: 1 }).lean(),
      WorkflowStepModel.find().sort({ order: 1 }).lean(),
    ]);
    return { services, rateCards, workflowSteps };
  } catch {
    return { services: [], rateCards: [], workflowSteps: [] };
  }
}

export default async function ServicesPage() {
  const [{ services, rateCards, workflowSteps }, settings] = await Promise.all([getData(), getSiteSettings()]);
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${absoluteUrl("/services")}#service`,
    name: `${settings.name} — Software Development Services`,
    url: absoluteUrl("/services"),
    description: settings.bio,
    areaServed: "Worldwide",
    provider: { "@id": `${siteUrl}/#person` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: (services as any[]).map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description },
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <RetroServicesPage osName={osName} services={services as any} rateCards={rateCards as any} workflowSteps={workflowSteps as any} />
    </>
  );
}
