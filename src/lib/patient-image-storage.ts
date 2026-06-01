import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".uploads", "patient-images");

export type StorageProvider = "blob" | "local";

export type StorageResult = {
  provider: StorageProvider;
  key: string;
};

export async function storePatientImage(
  patientId: string,
  imageId: string,
  buffer: Buffer,
  mimeType: string,
  ext: string,
): Promise<StorageResult> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const { put } = await import("@vercel/blob");
    const pathname = `patient-images/${patientId}/${imageId}.${ext}`;
    const blob = await put(pathname, buffer, {
      access: "private",
      contentType: mimeType,
      token,
    });
    return { provider: "blob", key: blob.url };
  }

  const dir = path.join(LOCAL_UPLOAD_DIR, patientId);
  await mkdir(dir, { recursive: true });
  const filename = `${imageId}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return { provider: "local", key: path.join(patientId, filename) };
}

export async function readPatientImage(
  provider: StorageProvider,
  key: string,
): Promise<{ buffer: Buffer; mimeType?: string } | null> {
  if (provider === "blob") {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;
    const { get } = await import("@vercel/blob");
    const result = await get(key, { access: "private", token });
    if (!result || result.statusCode !== 200) return null;
    const ab = await new Response(result.stream).arrayBuffer();
    return { buffer: Buffer.from(ab), mimeType: result.blob.contentType };
  }

  try {
    const buffer = await readFile(path.join(LOCAL_UPLOAD_DIR, key));
    return { buffer };
  } catch {
    return null;
  }
}

export async function deletePatientImage(provider: StorageProvider, key: string): Promise<void> {
  if (provider === "blob") {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const { del } = await import("@vercel/blob");
      await del(key, { token });
    }
    return;
  }

  try {
    await unlink(path.join(LOCAL_UPLOAD_DIR, key));
  } catch {
    // already removed
  }
}
