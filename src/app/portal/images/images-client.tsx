"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

type ImageRecord = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  caption: string | null;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PatientImagesClient() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/patient-images");
    if (!res.ok) {
      setError("Could not load images.");
      setImages([]);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { images?: ImageRecord[] };
    setImages(data.images ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setMsg("Choose an image first.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      if (caption.trim()) body.append("caption", caption.trim());

      const res = await fetch("/api/patient-images", { method: "POST", body });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(data.error ?? "Upload failed.");
        return;
      }

      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      setMsg("Uploaded.");
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this image? The clinic will no longer be able to view it.")) return;
    const res = await fetch(`/api/patient-images/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg("Could not delete.");
      return;
    }
    setMsg(null);
    await load();
  }

  if (loading) return <p className="mt-6 text-sm text-ink-muted">Loading…</p>;
  if (error) return <p className="mt-6 text-sm text-red-600">{error}</p>;

  return (
    <div className="mt-6 space-y-8">
      <Card className="!p-6">
        <form onSubmit={onUpload} className="space-y-4">
          <div>
            <Label htmlFor="image-file">Image</Label>
            <input
              id="image-file"
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              required
              className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-ink shadow-sm file:mr-3 file:rounded file:border-0 file:bg-cream-dark file:px-3 file:py-1 file:text-sm file:font-medium file:text-ink focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <Label htmlFor="image-caption">Note (optional)</Label>
            <Input
              id="image-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={500}
            />
          </div>
          {msg ? <p className="text-sm text-ink-muted">{msg}</p> : null}
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </Card>

      {images.length === 0 ? (
        <Card className="!p-6">
          <p className="text-sm text-ink-muted">No images uploaded yet.</p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {images.map((img) => (
            <li key={img.id}>
              <Card className="!p-4">
                <div className="overflow-hidden rounded-lg border border-stone-200 bg-cream-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/patient-images/${img.id}/file`}
                    alt={img.caption ?? img.filename}
                    className="max-h-48 w-full object-contain"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-ink">{img.caption ?? img.filename}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {new Date(img.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                  {formatSize(img.sizeBytes)}
                </p>
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  className="mt-3 text-xs font-semibold text-red-700 hover:underline"
                >
                  Remove
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
