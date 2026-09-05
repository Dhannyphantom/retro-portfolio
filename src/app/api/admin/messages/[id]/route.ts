import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Message from "@/models/Message";

// Read-only detail (marks as read on view) + status-only updates. The
// original message content is never editable here — only `status` and
// `notes` (internal, admin-only) can change.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const message = await Message.findById(id);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (message.status === "unread") {
    message.status = "read";
    await message.save();
  }
  return NextResponse.json({ message });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const allowed: Record<string, unknown> = {};
  if (typeof body.status === "string") allowed.status = body.status;
  if (typeof body.notes === "string") allowed.notes = body.notes;

  await connectDB();
  const message = await Message.findByIdAndUpdate(id, allowed, { new: true });
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message });
}
