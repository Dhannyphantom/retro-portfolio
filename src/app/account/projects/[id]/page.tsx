import { redirect, notFound } from "next/navigation";
import { getUserSession } from "@/lib/userAuth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getSiteSettings } from "@/lib/settings";
import RetroProjectDashboard from "@/components/retro/RetroProjectDashboard";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getUserSession();
  if (!session) redirect("/account/login");

  await connectDB();
  const [booking, settings] = await Promise.all([Booking.findById(id).lean(), getSiteSettings()]);
  if (!booking || String((booking as any).userId) !== session.userId) notFound();

  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;

  return <RetroProjectDashboard osName={osName} booking={JSON.parse(JSON.stringify(booking))} />;
}
