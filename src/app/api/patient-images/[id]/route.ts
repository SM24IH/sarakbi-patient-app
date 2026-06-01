import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deletePatientImage, type StorageProvider } from "@/lib/patient-image-storage";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.patientImage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = session.role === "PATIENT" && existing.patientId === session.sub;
  const isStaff = session.role === "STAFF";
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deletePatientImage(existing.storageProvider as StorageProvider, existing.storageKey);
  await prisma.patientImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
