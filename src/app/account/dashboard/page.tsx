import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/userAuth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { getSiteSettings } from "@/lib/settings";
import RetroAccountDashboard from "@/components/retro/RetroAccountDashboard";

export default async function AccountDashboard() {
  const session = await getUserSession();
  if (!session) redirect("/account/login");

  await connectDB();
  const [userDoc, bookings, settings] = await Promise.all([
    User.findById(session.userId).select("name email").lean(),
    Booking.find({ userId: session.userId }).sort({ createdAt: -1 }).lean(),
    getSiteSettings(),
  ]);
  const user = userDoc as unknown as { name?: string; email?: string } | null;
  const osName = `${settings.name.split(" ")[0].toLowerCase()}OS`;

  return (
    <RetroAccountDashboard
      osName={osName}
      userName={user?.name}
      bookings={JSON.parse(JSON.stringify(bookings))}
    />
  );
}
