// Sends transactional email via Brevo's REST API (no SMTP setup needed —
// just an API key). If BREVO_API_KEY isn't set, this quietly no-ops so the
// rest of the app (booking creation, contact form, etc.) still works without
// email configured — it just won't send anything.
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export function isEmailConfigured() {
  return !!process.env.BREVO_API_KEY;
}

type SendEmailArgs = {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<{ ok: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn(`[email] BREVO_API_KEY not set — skipped email "${subject}" to ${to.map((t) => t.email).join(", ")}`);
    return { ok: false, error: "Email not configured" };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "no-reply@example.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Portfolio";

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to,
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Brevo send failed:", res.status, body);
      return { ok: false, error: `Brevo returned ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send error:", err);
    return { ok: false, error: "Network error sending email" };
  }
}

// --- A few small templates used across the app ---

export function bookingConfirmationEmail({ name, referenceId, setupUrl }: { name: string; referenceId: string; setupUrl: string | null }) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Thanks, ${name} — your project brief is in.</h2>
      <p>Reference: <strong>${referenceId}</strong></p>
      <p>I'll take a look and get back to you within a day or two.</p>
      ${setupUrl ? `<p><a href="${setupUrl}" style="display:inline-block;padding:12px 20px;background:#8B2FE0;color:#fff;border-radius:6px;text-decoration:none;">Set up your project dashboard</a></p>` : ""}
    </div>
  `;
}

export function adminNewBookingEmail({ name, email, referenceId, projectType }: { name: string; email: string; referenceId: string; projectType: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>New project brief</h2>
      <p><strong>${name}</strong> (${email}) submitted a brief for <strong>${projectType}</strong>.</p>
      <p>Reference: ${referenceId}</p>
    </div>
  `;
}

export function adminNewMessageEmail({ name, email, message }: { name: string; email: string; message: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>New contact message</h2>
      <p><strong>${name}</strong> (${email}) wrote:</p>
      <p style="white-space:pre-wrap;">${message}</p>
    </div>
  `;
}

export function messageReplyEmail({ originalMessage, reply }: { originalMessage: string; reply: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <p style="white-space:pre-wrap;">${reply}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="color:#888; font-size: 13px;">In reply to: "${originalMessage.slice(0, 140)}${originalMessage.length > 140 ? "…" : ""}"</p>
    </div>
  `;
}
