import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ProjectMessage from "@/models/ProjectMessage";
import User from "@/models/User";
import { getSession as getAdminSession } from "@/lib/auth";
import { getUserSession } from "@/lib/userAuth";

// One thread per booking, shared by the client (their /account/projects/[id]
// page) and the admin (their /admin/bookings/[id] page). Access is resolved
// per-request: an admin session can view/post on any thread; a client
// session can only view/post on threads for bookings they own.
async function resolveAccess(bookingId: string) {
  await connectDB();
  const booking = (await Booking.findById(bookingId).lean()) as any;
  if (!booking) return { booking: null as any, role: null as "admin" | "client" | null, name: "" };

  const admin = await getAdminSession();
  if (admin) return { booking, role: "admin" as const, name: "Daniel" };

  const client = await getUserSession();
  if (client && String(booking.userId) === client.userId) {
    const user = (await User.findById(client.userId).select("name").lean()) as any;
    return { booking, role: "client" as const, name: user?.name || booking.name };
  }

  return { booking, role: null, name: "" };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const { booking, role } = await resolveAccess(bookingId);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Mark the other party's messages as read, and stamp this viewer's
  // last-visit time on the booking — both power the notification dots on
  // the dashboards.
  const otherRole = role === "admin" ? "client" : "admin";
  await ProjectMessage.updateMany({ bookingId, senderRole: otherRole, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
  await Booking.findByIdAndUpdate(bookingId, { [role === "admin" ? "lastViewedByAdminAt" : "lastViewedByClientAt"]: new Date() });

  const messages = await ProjectMessage.find({ bookingId }).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ booking, messages, viewerRole: role });
}

const proposalSchema = z.object({
  budget: z.number().nonnegative(),
  timeline: z.string().min(1),
  milestones: z.array(z.object({ title: z.string().min(1), description: z.string().optional(), dueDate: z.string().optional() })).optional(),
});

const schema = z.object({
  body: z.string().min(1).max(4000),
  proposal: proposalSchema.optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const { booking, role, name } = await resolveAccess(bookingId);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  // Only the admin proposes terms — the client's side of a negotiation is
  // plain messages plus approving/declining what's proposed.
  if (parsed.data.proposal && role !== "admin") {
    return NextResponse.json({ error: "Only the project owner can send a proposal." }, { status: 403 });
  }

  const msg = await ProjectMessage.create({
    bookingId,
    senderRole: role,
    senderName: name,
    body: parsed.data.body,
    proposal: parsed.data.proposal,
    proposalStatus: parsed.data.proposal ? "pending" : undefined,
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}
