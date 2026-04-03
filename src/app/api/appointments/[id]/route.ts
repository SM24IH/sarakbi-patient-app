import { AppointmentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const patchSchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
  staffNotes: z.string().max(2000).optional(),
  confirmedAt: z.string().datetime().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role === "PATIENT") {
    if (existing.patientId !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (parsed.data.status && parsed.data.status !== "CANCELLED") {
      return NextResponse.json({ error: "Patients may only cancel appointments" }, { status: 403 });
    }
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: parsed.data.status === "CANCELLED" ? "CANCELLED" : undefined,
      },
    });
    return NextResponse.json({ appointment: updated });
  }

  if (session.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: {
    status?: AppointmentStatus;
    staffNotes?: string | null;
    confirmedAt?: Date | null;
  } = {};
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.staffNotes !== undefined) data.staffNotes = parsed.data.staffNotes?.trim() || null;
  if (parsed.data.confirmedAt !== undefined) {
    data.confirmedAt = parsed.data.confirmedAt ? new Date(parsed.data.confirmedAt) : null;
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data,
  });

  return NextResponse.json({ appointment: updated });
}
