import { getPublicSiteUrl } from "@/lib/site-url";

function notifyEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function emailFrom(): string {
  return (
    process.env.STAFF_NOTIFY_FROM?.trim() ||
    "Mr Will Sarakbi Patient Portal <onboarding@resend.dev>"
  );
}

function portalUrl(path: string): string {
  const base = getPublicSiteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function excerpt(text: string, max = 500): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export async function sendPortalEmail(to: string, subject: string, text: string): Promise<void> {
  if (!notifyEnabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[portal-email] skipped (no RESEND_API_KEY):", subject, "→", to);
    }
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY!.trim());
  const { error } = await resend.emails.send({ from: emailFrom(), to: [to], subject, text });
  if (error) throw new Error(error.message);
}

export function notifyEmailLater(task: () => Promise<void>): void {
  void task().catch((err) => console.error("[portal-email]", err));
}

export async function notifyPatientNewMessage(params: {
  patientEmail: string;
  patientName: string;
  subject: string;
  body: string;
  threadId: string;
}): Promise<void> {
  const text = [
    "Hello " + params.patientName + ",",
    "",
    "The clinic team sent you a message in your patient portal.",
    "",
    `Subject: ${params.subject}`,
    "",
    excerpt(params.body),
    "",
    `Open: ${portalUrl(`/portal/messages/${params.threadId}`)}`,
    "",
    "This is not for emergencies — use the urgent line in your discharge letter if you are unwell.",
  ].join("\n");

  await sendPortalEmail(params.patientEmail, `Message from the clinic: ${params.subject}`, text);
}

export async function sendPatientInviteEmail(params: {
  email: string;
  name: string | null;
  inviteToken: string;
}): Promise<void> {
  const link = portalUrl(`/register?invite=${encodeURIComponent(params.inviteToken)}`);
  const text = [
    params.name ? `Hello ${params.name},` : "Hello,",
    "",
    "You have been invited to create your patient portal account with Mr Will Sarakbi's practice.",
    "",
    `Create your account: ${link}`,
    "",
    "This link expires in 14 days.",
  ].join("\n");

  await sendPortalEmail(params.email, "Your patient portal invitation", text);
}

export async function sendPasswordResetEmail(params: {
  email: string;
  name: string;
  resetToken: string;
}): Promise<void> {
  const link = portalUrl(`/reset-password?token=${encodeURIComponent(params.resetToken)}`);
  const text = [
    `Hello ${params.name},`,
    "",
    "We received a request to reset your patient portal password.",
    "",
    `Reset password: ${link}`,
    "",
    "This link expires in 1 hour. If you did not request this, you can ignore this email.",
  ].join("\n");

  await sendPortalEmail(params.email, "Reset your patient portal password", text);
}
