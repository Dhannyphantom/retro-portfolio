import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const settings = await SiteSettings.findOne({ key: "main" }).lean();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate({ key: "main" }, body, { new: true, upsert: true });
  return NextResponse.json({ settings });
}
