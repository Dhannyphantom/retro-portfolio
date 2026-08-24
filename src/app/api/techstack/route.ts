import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TechStack from "@/models/TechStack";

// Public: powers both the hero orbit badges and the marquee strip.
export async function GET() {
  try {
    await connectDB();
    const items = await TechStack.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ items: [] });
  }
}
