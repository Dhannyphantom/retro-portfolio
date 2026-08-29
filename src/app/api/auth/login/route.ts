import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

// A real bcrypt hash always looks like $2a$10$..., $2b$10$..., or $2y$10$...
const BCRYPT_SHAPE = /^\$2[aby]\$\d{2}\$.{53}$/;

function decodeStoredHash(): { hash: string | null; error: string | null } {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    let decoded = "";
    try {
      decoded = Buffer.from(b64, "base64").toString("utf8");
    } catch {
      return { hash: null, error: "ADMIN_PASSWORD_HASH_B64 isn't valid base64. Regenerate it with: npm run hash -- \"yourpassword\"" };
    }
    if (!BCRYPT_SHAPE.test(decoded)) {
      return { hash: null, error: "ADMIN_PASSWORD_HASH_B64 didn't decode to a valid bcrypt hash. Regenerate it with: npm run hash -- \"yourpassword\"" };
    }
    return { hash: decoded, error: null };
  }

  // Legacy path, kept for anyone who set the raw hash directly. This only
  // works if the `$` characters were escaped as `\$` in .env.local — plain
  // or single-quoted values get corrupted by Next's env loader either way.
  // Prefer ADMIN_PASSWORD_HASH_B64 (see hash-password.ts) to avoid this class
  // of bug entirely.
  const raw = process.env.ADMIN_PASSWORD_HASH;
  if (raw) {
    if (!BCRYPT_SHAPE.test(raw)) {
      return {
        hash: null,
        error:
          "ADMIN_PASSWORD_HASH doesn't look like a valid bcrypt hash — it's very likely been corrupted by dotenv variable expansion (the `$` characters get stripped). " +
          "Switch to ADMIN_PASSWORD_HASH_B64 instead: run `npm run hash -- \"yourpassword\"` and paste the line it prints.",
      };
    }
    return { hash: raw, error: null };
  }

  return { hash: null, error: null };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const { hash: adminHash, error: hashError } = decodeStoredHash();

  if (!adminEmail || !adminHash) {
    return NextResponse.json(
      { error: hashError || "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH_B64 (see README)." },
      { status: 500 }
    );
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, adminHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession(email);
  return NextResponse.json({ ok: true });
}
