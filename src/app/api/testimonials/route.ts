import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

// Public: approved testimonials only.
export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ approved: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ testimonials: [] });
  }
}

const schema = z.object({
  clientName: z.string().min(1).max(120),
  position: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  quote: z.string().min(1).max(1000),
  rating: z.number().min(1).max(5).optional(),
  project: z.string().max(200).optional(),
});

// Public: visitor-submitted testimonials. Stored with approved:false so they
// stay invisible on the site until reviewed and approved from /admin/testimonials.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill in the required fields.", details: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    await Testimonial.create({ ...parsed.data, approved: false });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
