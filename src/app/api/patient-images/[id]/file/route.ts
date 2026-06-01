import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readPatientImage, type StorageProvider } from "@/lib/patient-image-storage";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const image = await prisma.patientImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = session.role === "PATIENT" && image.patientId === session.sub;
  const isStaff = session.role === "STAFF";
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const file = await readPatientImage(image.storageProvider as StorageProvider, image.storageKey);
  if (!file) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.mimeType ?? image.mimeType,
      "Content-Length": String(file.buffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
