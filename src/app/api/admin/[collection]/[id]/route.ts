import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { REGISTRY } from "../../_registry";

// Generic admin update + delete endpoint for a single document.
// PATCH  /api/admin/projects/<id>
// DELETE /api/admin/projects/<id>
export async function PATCH(req: NextRequest, { params }: { params: { collection: string; id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const Model = REGISTRY[params.collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = await req.json();
    await connectDB();
    const doc = await Model.findByIdAndUpdate(params.id, body, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: doc });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { collection: string; id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const Model = REGISTRY[params.collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  await connectDB();
  await Model.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
