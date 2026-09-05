import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Message from "@/models/Message";

// List-only. Detail viewing (which marks as read), status changes and
// replying all go through /api/admin/messages/[id] and .../reply — there's
// deliberately no generic create/edit here, since the original message
// content should never be editable by the admin.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const items = await Message.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}
