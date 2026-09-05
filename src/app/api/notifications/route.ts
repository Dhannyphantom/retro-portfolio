import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import ProjectMessage from "@/models/ProjectMessage";
import { getSession as getAdminSession } from "@/lib/auth";
import { getUserSession } from "@/lib/userAuth";

// Polled every few seconds by both dashboards to drive the little pulsing
// notification dots — kept intentionally cheap (counts only, no documents).
export async function GET() {
  await connectDB();

  const admin = await getAdminSession();
  if (admin) {
    const [unreadMessages, newBookings, unreadThreadMessages] = await Promise.all([
      Message.countDocuments({ status: "unread" }),
      Booking.countDocuments({ status: "New" }),
      ProjectMessage.countDocuments({ senderRole: "client", readAt: { $exists: false } }),
    ]);
    return NextResponse.json({
      role: "admin",
      messages: unreadMessages,
      bookings: newBookings,
      threads: unreadThreadMessages,
      total: unreadMessages + newBookings + unreadThreadMessages,
    });
  }

  const client = await getUserSession();
  if (client) {
    const bookings = await Booking.find({ userId: client.userId }).select("_id updatedAt lastViewedByClientAt").lean();
    const bookingIds = bookings.map((b: any) => b._id);
    const [unreadThreadMessages, updatedBookings] = await Promise.all([
      ProjectMessage.countDocuments({ bookingId: { $in: bookingIds }, senderRole: "admin", readAt: { $exists: false } }),
      bookings.filter((b: any) => !b.lastViewedByClientAt || new Date(b.updatedAt) > new Date(b.lastViewedByClientAt)).length,
    ]);
    return NextResponse.json({
      role: "client",
      threads: unreadThreadMessages,
      updates: updatedBookings,
      total: unreadThreadMessages + updatedBookings,
    });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
