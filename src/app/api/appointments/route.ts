import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const createSchema = z.object({
  location: z.enum(["Cadogan Clinic, Chelsea", "Shirley Oaks Hospital, Surrey"]),
  type: z.string().min(1).max(200),
  requestedAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const appt = await prisma.appointment.create({
    data: {
      patientId: session.sub,
      location: parsed.data.location,
      type: parsed.data.type,
      requestedAt: new Date(parsed.data.requestedAt),
      notes: parsed.data.notes?.trim() || null,
    },
  });

  return NextResponse.json({ appointment: appt });
}
