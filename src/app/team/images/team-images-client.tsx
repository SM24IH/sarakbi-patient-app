"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui";

type Patient = { id: string; name: string; email: string };

type ImageRecord = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  caption: string | null;
  createdAt: string;
  patient: Patient;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TeamImagesClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [patientFilter, setPatientFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    const res = await fetch("/api/patients");
    const data = (await res.json()) as { patients?: Patient[] };
    setPatients(data.patients ?? []);
  }, []);

  const loadImages = useCallback(async (filter: string) => {
    const qs = filter ? `?patientId=${encodeURIComponent(filter)}` : "";
    const res = await fetch(`/api/patient-images${qs}`);
    const data = (await res.json()) as { images?: ImageRecord[] };
    setImages(data.images ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadPatients();
      await loadImages("");
      setLoading(false);
    })();
  }, [loadPatients, loadImages]);

  useEffect(() => {
    if (loading) return;
    loadImages(patientFilter);
  }, [patientFilter, loadImages, loading]);

  async function remove(id: string) {
    if (!confirm("Remove this patient image from the portal?")) return;
    const res = await fetch(`/api/patient-images/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg("Could not delete.");
      return;
    }
    setMsg(null);
    await loadImages(patientFilter);
  }

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="patient-filter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Filter by patient
        </label>
        <select
          id="patient-filter"
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="w-full max-w-md rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
        >
          <option value="">All patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
      </div>

      {msg ? <p className="text-sm text-red-600">{msg}</p> : null}

      {images.length === 0 ? (
        <Card className="!p-6">
          <p className="text-sm text-ink-muted">No patient images yet.</p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <li key={img.id}>
              <Card className="!p-4">
                <div className="overflow-hidden rounded-lg border border-stone-200 bg-cream-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/patient-images/${img.id}/file`}
                    alt={img.caption ?? img.filename}
                    className="max-h-40 w-full object-contain"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-ink">{img.patient.name}</p>
                <p className="text-xs text-ink-muted">{img.patient.email}</p>
                {img.caption ? <p className="mt-2 text-sm text-ink">{img.caption}</p> : null}
                <p className="mt-2 text-xs text-ink-muted">
                  {new Date(img.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                  {formatSize(img.sizeBytes)}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <a
                    href={`/api/patient-images/${img.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal hover:underline"
                  >
                    Open full size
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(img.id)}
                    className="font-semibold text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
