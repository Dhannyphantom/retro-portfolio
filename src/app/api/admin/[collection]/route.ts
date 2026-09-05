import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { REGISTRY } from "../_registry";

// Generic admin list + create endpoint, shared by every manageable collection.
// GET  /api/admin/projects        -> list all (admin only)
// POST /api/admin/projects        -> create one (admin only)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection } = await params;
  const Model = REGISTRY[collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  await connectDB();
  const items = await Model.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection } = await params;
  if (collection === "bookings") {
    return NextResponse.json({ error: "Bookings are created by clients through /hire, not manually." }, { status: 403 });
  }

  const Model = REGISTRY[collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = await req.json();
    await connectDB();
    const doc = await Model.create(body);
    return NextResponse.json({ item: doc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid data" }, { status: 400 });
  }
}
