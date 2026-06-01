import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { deletePatientImage, type StorageProvider } from "@/lib/patient-image-storage";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.user.findUnique({
    where: { id, role: Role.PATIENT },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      appointments: {
        orderBy: { requestedAt: "desc" },
        take: 5,
        select: {
          id: true,
          type: true,
          location: true,
          requestedAt: true,
          status: true,
        },
      },
      threads: {
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, subject: true, category: true, updatedAt: true },
      },
      documents: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      },
      patientImages: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, filename: true, caption: true, createdAt: true },
      },
      _count: {
        select: { appointments: true, threads: true, patientImages: true, documents: true },
      },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ patient });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.user.findUnique({
    where: { id },
    include: { patientImages: { select: { storageProvider: true, storageKey: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.role !== Role.PATIENT) {
    return NextResponse.json({ error: "Only patient accounts can be removed" }, { status: 400 });
  }

  for (const img of existing.patientImages) {
    await deletePatientImage(img.storageProvider as StorageProvider, img.storageKey).catch(() => {});
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
