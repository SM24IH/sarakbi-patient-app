import { categoryLabel } from "@/lib/message-categories";
import { getPublicSiteUrl } from "@/lib/site-url";

function notifyEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getStaffNotifyEmail(): string {
  return process.env.STAFF_NOTIFY_EMAIL?.trim() || "pa@willsarakbi.com";
}

function notifyFrom(): string {
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

async function sendStaffEmail(subject: string, text: string): Promise<void> {
  if (!notifyEnabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[staff-notify] skipped (RESEND_API_KEY not set):", subject);
    }
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY!.trim());

  const { error } = await resend.emails.send({
    from: notifyFrom(),
    to: [getStaffNotifyEmail()],
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/** Fire-and-forget — never blocks or fails the patient request. */
export function notifyStaffLater(task: () => Promise<void>): void {
  void task().catch((err) => console.error("[staff-notify]", err));
}

export async function notifyStaffNewMessage(params: {
  patientName: string;
  patientEmail: string;
  subject: string;
  category: string | null;
  body: string;
  threadId: string;
  isNewThread: boolean;
}): Promise<void> {
  const heading = params.isNewThread ? "New patient message" : "New patient reply";
  const text = [
    heading,
    "",
    `Patient: ${params.patientName} (${params.patientEmail})`,
    `Category: ${categoryLabel(params.category)}`,
    `Subject: ${params.subject}`,
    "",
    excerpt(params.body),
    "",
    `Open: ${portalUrl(`/team/messages/${params.threadId}`)}`,
  ].join("\n");

  await sendStaffEmail(`${heading}: ${params.subject}`, text);
}

export async function notifyStaffNewAppointment(params: {
  patientName: string;
  patientEmail: string;
  type: string;
  location: string;
  requestedAt: Date;
  notes: string | null;
  appointmentId: string;
}): Promise<void> {
  const when = params.requestedAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  const text = [
    "New appointment request",
    "",
    `Patient: ${params.patientName} (${params.patientEmail})`,
    `Type: ${params.type}`,
    `Location: ${params.location}`,
    `Requested: ${when}`,
    params.notes ? `\nNotes: ${excerpt(params.notes, 800)}` : "",
    "",
    `Open: ${portalUrl("/team/appointments")}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendStaffEmail(`Appointment request: ${params.patientName}`, text);
}

export async function notifyStaffNewPhoto(params: {
  patientName: string;
  patientEmail: string;
  filename: string;
  caption: string | null;
  imageId: string;
}): Promise<void> {
  const text = [
    "New patient photo upload",
    "",
    `Patient: ${params.patientName} (${params.patientEmail})`,
    `File: ${params.filename}`,
    params.caption ? `Note: ${params.caption}` : "",
    "",
    `Open: ${portalUrl("/team/images")}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendStaffEmail(`Photo upload: ${params.patientName}`, text);
}
