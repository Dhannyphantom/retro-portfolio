import { connectDB } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import RateCardModel from "@/models/RateCard";
import WorkflowStepModel from "@/models/WorkflowStep";
import { getSiteSettings } from "@/lib/settings";
import RetroServicesPage from "@/components/retro/RetroServicesPage";

const FALLBACK_SERVICES = [
  { title: "Mobile Development", description: "React Native apps built for real users.", icon: "Smartphone" },
  { title: "Web Development", description: "Next.js sites with motion, structure and copy that earns attention.", icon: "Globe" },
  { title: "Backend & APIs", description: "Node.js and MongoDB systems built to stay boring under real traffic.", icon: "Server" },
  { title: "MVP Development", description: "Ship a working product fast without boxing out scaling later.", icon: "Rocket" },
  { title: "Performance Optimization", description: "Faster loads, leaner bundles, fewer re-renders.", icon: "Zap" },
  { title: "Maintenance & Scaling", description: "Keeping shipped products healthy as usage grows.", icon: "Wrench" },
];
const FALLBACK_RATECARDS = [
  { name: "Hourly", billingType: "hourly", price: "$35", unit: "/ hour", description: "For focused, well-scoped work.", features: ["Flexible engagement", "Weekly time logs", "Async updates", "No minimum commitment"] },
  { name: "Project-Based", billingType: "project", price: "$1,200", unit: "starting at", description: "For a defined product or feature set.", features: ["Fixed scope & timeline", "Milestone check-ins", "Source code ownership", "30 days post-launch support"], recommended: true },
  { name: "Monthly Retainer", billingType: "retainer", price: "$800", unit: "/ month", description: "For ongoing product partnership.", features: ["Priority response time", "Feature + maintenance work", "Monthly planning call", "Cancel anytime"] },
];
const FALLBACK_WORKFLOW = [
  { icon: "Search", title: "Discover", description: "Understand the problem before touching code." },
  { icon: "PenTool", title: "Plan", description: "Map scope, architecture and milestones." },
  { icon: "Code2", title: "Design", description: "Structure the data, screens and flows." },
  { icon: "Hammer", title: "Build", description: "Ship in small, reviewable increments." },
  { icon: "TestTube2", title: "Test", description: "Catch issues before your users do." },
  { icon: "Rocket", title: "Launch", description: "Ship it — deploy, monitor, stabilize." },
  { icon: "TrendingUp", title: "Scale", description: "Grow the system as real usage arrives." },
];

async function getData() {
  try {
    await connectDB();
    const [services, rateCards, workflowSteps] = await Promise.all([
      ServiceModel.find().sort({ order: 1 }).lean(),
      RateCardModel.find().sort({ order: 1 }).lean(),
      WorkflowStepModel.find().sort({ order: 1 }).lean(),
    ]);
    return {
      services: services.length ? services : FALLBACK_SERVICES,
      rateCards: rateCards.length ? rateCards : FALLBACK_RATECARDS,
      workflowSteps: workflowSteps.length ? workflowSteps : FALLBACK_WORKFLOW,
    };
  } catch {
    return { services: FALLBACK_SERVICES, rateCards: FALLBACK_RATECARDS, workflowSteps: FALLBACK_WORKFLOW };
  }
}

export default async function ServicesPage() {
  const [{ services, rateCards, workflowSteps }, settings] = await Promise.all([getData(), getSiteSettings()]);
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;
  return <RetroServicesPage osName={osName} services={services as any} rateCards={rateCards as any} workflowSteps={workflowSteps as any} />;
}
