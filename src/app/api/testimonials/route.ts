import { NextResponse } from "next/server";
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
