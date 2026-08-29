import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ProjectMessage from "@/models/ProjectMessage";
import { getUserSession } from "@/lib/userAuth";

const schema = z.object({ messageId: z.string().min(1), decision: z.enum(["approve", "decline"]) });

// Only the client who owns the booking can approve/decline a proposal — this
// is the step where negotiated budget/timeline/milestones become the
// booking's official, agreed-upon values.
export async function POST(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const booking = await Booking.findById(bookingId);
  if (!booking || String(booking.userId) !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const msg = await ProjectMessage.findOne({ _id: parsed.data.messageId, bookingId });
  if (!msg || !msg.proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  if (msg.proposalStatus !== "pending") {
    return NextResponse.json({ error: "This proposal has already been resolved." }, { status: 409 });
  }

  msg.proposalStatus = parsed.data.decision === "approve" ? "approved" : "declined";
  await msg.save();

  if (parsed.data.decision === "approve") {
    booking.totalBudget = msg.proposal.budget;
    booking.approvedTimeline = msg.proposal.timeline;
    if (msg.proposal.milestones?.length) {
      booking.milestones = msg.proposal.milestones.map((m: { title: string; description?: string; dueDate?: string }) => ({ title: m.title, description: m.description, dueDate: m.dueDate, status: "pending", media: [] }));
    }
    booking.status = "Won";
    await booking.save();
  }

  return NextResponse.json({ ok: true, booking });
}
