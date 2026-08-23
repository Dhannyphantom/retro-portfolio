import { connectDB } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import RateCardModel from "@/models/RateCard";
import Services from "@/components/sections/Services";
import RateCards from "@/components/sections/RateCards";
import HowIWork from "@/components/sections/HowIWork";

async function getData() {
  try {
    await connectDB();
    const [services, rateCards] = await Promise.all([
      ServiceModel.find().sort({ order: 1 }).lean(),
      RateCardModel.find().sort({ order: 1 }).lean(),
    ]);
    return { services: services.length ? services : undefined, rateCards: rateCards.length ? rateCards : undefined };
  } catch {
    return { services: undefined, rateCards: undefined };
  }
}

export default async function ServicesPage() {
  const { services, rateCards } = await getData();
  return (
    <div className="pt-10">
      <Services items={services as any} />
      <HowIWork />
      <RateCards items={rateCards as any} />
    </div>
  );
}
