import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Message from "@/models/Message";
import { sendEmail, messageReplyEmail } from "@/lib/email";

const schema = z.object({ body: z.string().min(1).max(4000) });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Reply can't be empty." }, { status: 400 });

  await connectDB();
  const message = await Message.findById(id);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await sendEmail({
    to: [{ email: message.email, name: message.name }],
    subject: "Re: your message",
    html: messageReplyEmail({ originalMessage: message.message, reply: parsed.data.body }),
  });

  message.replies.push({ body: parsed.data.body, sentAt: new Date(), emailedOk: result.ok });
  message.status = "read";
  await message.save();

  return NextResponse.json({ message, emailed: result.ok });
}
