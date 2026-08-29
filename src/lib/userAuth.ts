import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");
const COOKIE_NAME = "user_session";

// Separate cookie/session from the admin one (lib/auth.ts) — a client and an
// admin can be logged in on the same browser at the same time without
// clobbering each other.
export async function createUserSession(userId: string, email: string) {
  const token = await new SignJWT({ userId, email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Short-lived token embedded in the "set up your dashboard" link shown right
// after a booking is submitted. Carries just enough to let /account/setup
// find the right (passwordless) user account and let them set a password —
// there's no email service wired up, so this link is shown directly on the
// booking success screen instead of being emailed.
export async function createSetupToken(email: string) {
  return new SignJWT({ email, purpose: "account-setup" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySetupToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "account-setup" || typeof payload.email !== "string") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}
