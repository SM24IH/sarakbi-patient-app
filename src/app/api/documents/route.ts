import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const createSchema = z.object({
  patientId: z.string().min(1),
  title: z.string().min(1).max(200),
  documentUrl: z.string().url().max(2000).refine((u) => u.startsWith("https://"), {
    message: "URL must use https://",
  }),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "PATIENT") {
    const documents = await prisma.document.findMany({
      where: { patientId: session.sub },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        documentUrl: true,
        notes: true,
        createdAt: true,
        createdBy: { select: { name: true } },
      },
    });
    return NextResponse.json({ documents });
  }

  if (session.role === "STAFF") {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId")?.trim();
    const documents = await prisma.document.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        createdBy: { select: { name: true } },
      },
    });
    return NextResponse.json({ documents });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
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

  const patient = await prisma.user.findUnique({
    where: { id: parsed.data.patientId },
  });
  if (!patient || patient.role !== Role.PATIENT) {
    return NextResponse.json({ error: "Invalid patient" }, { status: 400 });
  }

  const doc = await prisma.document.create({
    data: {
      patientId: parsed.data.patientId,
      title: parsed.data.title.trim(),
      documentUrl: parsed.data.documentUrl.trim(),
      notes: parsed.data.notes?.trim() || null,
      createdById: session.sub,
    },
  });

  return NextResponse.json({ document: doc });
}
