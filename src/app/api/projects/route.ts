import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

// Public: powers the /projects archive page.
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1 }).lean();
    return NextResponse.json({ projects });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ projects: [] });
  }
}
