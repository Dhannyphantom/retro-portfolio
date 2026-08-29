import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { getUserSession } from "@/lib/userAuth";

export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [user, bookings] = await Promise.all([
    User.findById(session.userId).select("name email").lean(),
    Booking.find({ userId: session.userId }).sort({ createdAt: -1 }).lean(),
  ]);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user, bookings });
}
