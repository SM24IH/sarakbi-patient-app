import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { storePatientImage } from "@/lib/patient-image-storage";
import {
  extensionForMime,
  PATIENT_IMAGE_ALLOWED_MIME,
  PATIENT_IMAGE_MAX_BYTES,
} from "@/lib/patient-images-config";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const imageSelect = {
  id: true,
  filename: true,
  mimeType: true,
  sizeBytes: true,
  caption: true,
  createdAt: true,
} as const;

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "PATIENT") {
    const images = await prisma.patientImage.findMany({
      where: { patientId: session.sub },
      orderBy: { createdAt: "desc" },
      select: imageSelect,
    });
    return NextResponse.json({ images });
  }

  if (session.role === "STAFF") {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId")?.trim();
    const images = await prisma.patientImage.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        ...imageSelect,
        patient: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ images });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";
  if (!PATIENT_IMAGE_ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or HEIC images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > PATIENT_IMAGE_MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller" }, { status: 400 });
  }

  const ext = extensionForMime(mimeType);
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  const captionRaw = formData.get("caption");
  const caption =
    typeof captionRaw === "string" && captionRaw.trim() ? captionRaw.trim().slice(0, 500) : null;

  const buffer = Buffer.from(await file.arrayBuffer());

  const record = await prisma.patientImage.create({
    data: {
      patientId: session.sub,
      filename: file.name.slice(0, 255) || `image.${ext}`,
      mimeType,
      sizeBytes: buffer.length,
      caption,
      storageProvider: "local",
      storageKey: "pending",
    },
  });

  try {
    const stored = await storePatientImage(session.sub, record.id, buffer, mimeType, ext);
    const image = await prisma.patientImage.update({
      where: { id: record.id },
      data: {
        storageProvider: stored.provider,
        storageKey: stored.key,
      },
      select: imageSelect,
    });
    return NextResponse.json({ image });
  } catch (err) {
    await prisma.patientImage.delete({ where: { id: record.id } }).catch(() => {});
    console.error("Patient image upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
