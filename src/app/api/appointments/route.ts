import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlotISOStrings, isRequestedSlotValid } from "@/lib/appointment-slots";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const createSchema = z.object({
  location: z.enum(["Cadogan Clinic, Chelsea", "Shirley Oaks Hospital, Surrey"]),
  type: z.string().min(1).max(200),
  requestedAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

const slotsQuerySchema = z.object({
  location: z.enum(["Cadogan Clinic, Chelsea", "Shirley Oaks Hospital, Surrey"]),
});

/**
 * GET /api/appointments — list appointments.
 * GET /api/appointments?slots=1&location=... — available slot starts (patients only). Same behaviour as GET /api/appointment-slots; kept here so older deploys and this route file always expose slots (avoids HTML 404 if /api/appointment-slots is missing).
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  if (url.searchParams.get("slots") === "1") {
    if (session.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const parsed = slotsQuerySchema.safeParse({ location: url.searchParams.get("location") ?? undefined });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }
    try {
      const slots = await getAvailableSlotISOStrings(prisma, parsed.data.location);
      return NextResponse.json({ slots });
    } catch (e) {
      console.error("[appointments GET slots]", e);
      return NextResponse.json({ error: "Could not load appointment slots" }, { status: 500 });
    }
  }

  if (session.role === "PATIENT") {
    const items = await prisma.appointment.findMany({
      where: { patientId: session.sub },
      orderBy: { requestedAt: "asc" },
    });
    return NextResponse.json({ appointments: items });
  }

  const items = await prisma.appointment.findMany({
    include: { patient: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { requestedAt: "asc" },
  });
  return NextResponse.json({ appointments: items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const requestedAt = new Date(parsed.data.requestedAt);
  const ok = await isRequestedSlotValid(prisma, parsed.data.location, requestedAt);
  if (!ok) {
    return NextResponse.json(
      { error: "That time is not available. Please choose another slot from the list." },
      { status: 409 },
    );
  }

  const clash = await prisma.appointment.findFirst({
    where: {
      location: parsed.data.location,
      status: { in: ["REQUESTED", "CONFIRMED"] },
      requestedAt,
    },
  });
  if (clash) {
    return NextResponse.json(
      { error: "That time was just taken. Please refresh and choose another slot." },
      { status: 409 },
    );
  }

  const appt = await prisma.appointment.create({
    data: {
      patientId: session.sub,
      location: parsed.data.location,
      type: parsed.data.type,
      requestedAt,
      notes: parsed.data.notes?.trim() || null,
    },
  });

  return NextResponse.json({ appointment: appt });
}
