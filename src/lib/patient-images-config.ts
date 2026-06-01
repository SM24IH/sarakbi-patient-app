export const PATIENT_IMAGE_MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export const PATIENT_IMAGE_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export function extensionForMime(mimeType: string): string | null {
  return MIME_EXT[mimeType] ?? null;
}
