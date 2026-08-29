import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifySetupToken, createUserSession } from "@/lib/userAuth";

const schema = z.object({ token: z.string().min(1), password: z.string().min(8, "Use at least 8 characters.") });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }

  const claim = await verifySetupToken(parsed.data.token);
  if (!claim) {
    return NextResponse.json({ error: "This setup link is invalid or has expired. Log in to request a new one, or contact support." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: claim.email });
  if (!user) {
    return NextResponse.json({ error: "No account found for this link." }, { status: 404 });
  }

  user.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await user.save();

  await createUserSession(String(user._id), user.email);
  return NextResponse.json({ ok: true });
}
