import { connectDB } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import RateCardModel from "@/models/RateCard";
import WorkflowStepModel from "@/models/WorkflowStep";
import { getSiteSettings } from "@/lib/settings";
import RetroServicesPage from "@/components/retro/RetroServicesPage";

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
  return <RetroServicesPage osName={osName} services={services as any} rateCards={rateCards as any} workflowSteps={workflowSteps as any} />;
}
