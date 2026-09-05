import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Testimonial from "@/models/Testimonial";
import User from "@/models/User";
import { getUserSession } from "@/lib/userAuth";

const schema = z.object({ quote: z.string().min(1).max(1000), rating: z.number().min(1).max(5) });

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const testimonial = await Testimonial.findOne({ bookingId: id }).lean();
  return NextResponse.json({ testimonial });
}

// A client can leave one review per project, submittable once the project
// has real progress (kept simple here: allowed any time after booking
// creation — tighten to `status === "Won"` etc. if you want to gate it).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Add a rating and a short review." }, { status: 400 });

  await connectDB();
  const booking = await Booking.findById(id);
  if (!booking || String(booking.userId) !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await Testimonial.findOne({ bookingId: id });
  if (existing) return NextResponse.json({ error: "You've already reviewed this project." }, { status: 409 });

  const user = await User.findById(session.userId).select("name").lean();
  const testimonial = await Testimonial.create({
    clientName: (user as any)?.name || booking.name,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
    project: booking.projectType,
    bookingId: id,
    approved: false,
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}
