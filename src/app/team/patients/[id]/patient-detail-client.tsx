"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { categoryLabel } from "@/lib/message-categories";

type PatientDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  appointments: Array<{
    id: string;
    type: string;
    location: string;
    requestedAt: string;
    status: string;
  }>;
  threads: Array<{ id: string; subject: string; category: string | null; updatedAt: string }>;
  documents: Array<{ id: string; title: string; createdAt: string }>;
  patientImages: Array<{ id: string; filename: string; caption: string | null; createdAt: string }>;
  _count: { appointments: number; threads: number; patientImages: number; documents: number };
};

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/patients/${patientId}`);
    if (!res.ok) {
      setError("Patient not found.");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { patient: PatientDetail };
    setPatient(data.patient);
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;
  if (error || !patient) return <p className="text-sm text-red-600">{error ?? "Not found"}</p>;

  return (
    <div>
      <Link href="/team/patients" className="text-sm text-teal hover:underline">
        ← All patients
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">{patient.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {patient.email}
        {patient.phone ? ` · ${patient.phone}` : ""}
      </p>
      <p className="mt-1 text-xs text-stone-500">
        Joined {new Date(patient.createdAt).toLocaleDateString()} · {patient._count.appointments} appointments ·{" "}
        {patient._count.threads} threads · {patient._count.patientImages} photos · {patient._count.documents}{" "}
        documents
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/team/messages?compose=1&patientId=${patient.id}`}
          className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-light"
        >
          Message patient
        </Link>
        <Link href={`/team/images?patientId=${patient.id}`} className="text-sm font-semibold text-teal hover:underline">
          Photos
        </Link>
        <Link href="/team/appointments" className="text-sm font-semibold text-teal hover:underline">
          Appointments
        </Link>
        <Link href="/team/documents" className="text-sm font-semibold text-teal hover:underline">
          Documents
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="!p-5">
          <h2 className="font-serif text-lg font-semibold text-teal">Recent messages</h2>
          {patient.threads.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">None yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {patient.threads.map((t) => (
                <li key={t.id}>
                  <Link href={`/team/messages/${t.id}`} className="text-sm text-ink hover:text-teal">
                    {t.subject}
                    <span className="ml-2 text-xs text-ink-muted">{categoryLabel(t.category)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="!p-5">
          <h2 className="font-serif text-lg font-semibold text-teal">Recent appointments</h2>
          {patient.appointments.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">None yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {patient.appointments.map((a) => (
                <li key={a.id}>
                  {a.type} · {a.location} · {new Date(a.requestedAt).toLocaleString()} · {a.status}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="!p-5">
          <h2 className="font-serif text-lg font-semibold text-teal">Recent photos</h2>
          {patient.patientImages.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">None yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {patient.patientImages.map((img) => (
                <li key={img.id}>
                  <Link href={`/team/images?patientId=${patient.id}`} className="text-teal hover:underline">
                    {img.caption ?? img.filename}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="!p-5">
          <h2 className="font-serif text-lg font-semibold text-teal">Shared documents</h2>
          {patient.documents.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">None yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {patient.documents.map((d) => (
                <li key={d.id}>{d.title}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
