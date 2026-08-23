import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

// Public: single project by slug (used by the case-study page or client fetches).
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const project = await Project.findOne({ slug: params.slug }).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
