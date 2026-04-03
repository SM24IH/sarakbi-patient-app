import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

function escapeICS(value: string) {
  // RFC 5545 escaping for text fields
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toICSUTC(d: Date) {
  // 2026-03-30T12:34:56.000Z => 20260330T123456Z
  return d.toISOString().replace(/[-:]/g, "").replace(".000", "") + "Z";
}

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const appt = await prisma.appointment.findUnique({
    where: { id },
    select: {
      id: true,
      patientId: true,
      location: true,
      type: true,
      requestedAt: true,
      status: true,
    },
  });

  if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.role === "PATIENT" && appt.patientId !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.role !== "PATIENT" && session.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const start = appt.requestedAt;
  const end = new Date(start.getTime() + 60 * 60 * 1000); // default 1 hour slot
  const now = new Date();

  const summary = appt.type || "Appointment";
  const location = appt.location || "";
  const description =
    appt.status === "CANCELLED"
      ? "This appointment has been cancelled. Your clinic will confirm next steps."
      : "Reminder from your practice portal. Use your discharge/clinic instructions for any medical guidance.";

  const uid = `${appt.id}@sarakbi-patient-app`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mr Will Sarakbi//Patient Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSUTC(now)}`,
    `DTSTART:${toICSUTC(start)}`,
    `DTEND:${toICSUTC(end)}`,
    `SUMMARY:${escapeICS(summary)}`,
    `LOCATION:${escapeICS(location)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"appointment-${appt.id}.ics\"`,
    },
  });
}

