import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { REGISTRY } from "../../_registry";

// Fields on a booking that came directly from the client's own submission —
// never editable by the admin, even via this generic endpoint. Everything
// else on a booking (status, budget, milestones, currency, internal notes)
// is fair game and still goes through here.
const BOOKING_PROTECTED_FIELDS = [
  "name", "email", "company", "phone", "projectType", "description",
  "budget", "timeline", "servicesNeeded", "preferredContact",
  "preferredStartDate", "documentUrl", "documentName", "referenceId", "userId",
];

function sanitizeBody(collection: string, body: Record<string, unknown>) {
  if (collection !== "bookings") return body;
  const clean = { ...body };
  for (const field of BOOKING_PROTECTED_FIELDS) delete clean[field];
  return clean;
}

// Generic admin update + delete endpoint for a single document.
// PATCH  /api/admin/projects/<id>
// DELETE /api/admin/projects/<id>
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection, id } = await params;
  const Model = REGISTRY[collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = sanitizeBody(collection, await req.json());
    await connectDB();
    const doc = await Model.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: doc });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collection, id } = await params;
  const Model = REGISTRY[collection];
  if (!Model) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  await connectDB();
  await Model.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
