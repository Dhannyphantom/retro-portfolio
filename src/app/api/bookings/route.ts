import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { generateRef } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { createSetupToken } from "@/lib/userAuth";

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

    // Find or create the client's account. New accounts have no password yet
    // — the booking success screen links to /account/setup so they can set
    // one and immediately see their project dashboard.
    const email = parsed.data.email.toLowerCase();
    let user = await User.findOne({ email });
    let isNewAccount = false;
    if (!user) {
      user = await User.create({ name: parsed.data.name, email });
      isNewAccount = true;
    }

    const referenceId = generateRef("BK");
    const doc = await Booking.create({ ...parsed.data, email, referenceId, userId: user._id });

    const needsPasswordSetup = isNewAccount || !user.passwordHash;
    const setupToken = needsPasswordSetup ? await createSetupToken(email) : null;

    return NextResponse.json(
      {
        ok: true,
        referenceId: doc.referenceId,
        needsPasswordSetup,
        setupToken,
        email,
      },
      { status: 201 }
    );
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
