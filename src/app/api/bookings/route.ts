import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { generateRef } from "@/lib/utils";
import { getSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1),
  description: z.string().min(1),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  servicesNeeded: z.array(z.string()).optional(),
  preferredContact: z.string().optional(),
  preferredStartDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const referenceId = generateRef("BK");
    const doc = await Booking.create({ ...parsed.data, referenceId });
    return NextResponse.json({ ok: true, referenceId: doc.referenceId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Admin-only: list bookings for the dashboard.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ bookings });
}
