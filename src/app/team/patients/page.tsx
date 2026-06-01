"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { appointments: number; threads: number };
};

export default function TeamPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setMsg(null);
    const res = await fetch("/api/patients");
    const data = (await res.json()) as { patients?: Patient[] };
    setPatients(data.patients ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function removePatient(p: Patient) {
    const ok = confirm(
      `Remove ${p.name} (${p.email}) from the portal?\n\nThis permanently deletes their account, messages, appointments, photos, and shared documents. This cannot be undone.`,
    );
    if (!ok) return;

    setDeletingId(p.id);
    setMsg(null);
    try {
      const res = await fetch(`/api/patients/${p.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(data.error ?? "Could not remove patient.");
        return;
      }
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Patients</h1>
      <p className="mt-2 text-sm text-ink-muted">Portal accounts — remove duplicates or test patients when needed.</p>
      {msg ? <p className="mt-4 text-sm text-red-600">{msg}</p> : null}
      {loading ? (
        <p className="mt-8 text-sm text-ink-muted">Loading…</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {patients.map((p) => (
            <li key={p.id}>
              <Card className="!p-4">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-sm text-ink-muted">{p.email}</p>
                {p.phone && <p className="text-sm text-ink-muted">{p.phone}</p>}
                <p className="mt-2 text-xs text-stone-500">
                  {p._count.appointments} appointments · {p._count.threads} threads · joined{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href={`/team/patients/${p.id}`} className="font-medium text-teal hover:underline">
                    View record
                  </Link>
                  <Link href="/team/messages" className="font-medium text-teal hover:underline">
                    Inbox
                  </Link>
                  <Link
                    href={`/team/images?patientId=${encodeURIComponent(p.id)}`}
                    className="font-medium text-teal hover:underline"
                  >
                    Photos
                  </Link>
                  <Link href="/team/appointments" className="font-medium text-teal hover:underline">
                    Appointments
                  </Link>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 !border-red-200 !text-red-700 hover:!bg-red-50"
                  disabled={deletingId === p.id}
                  onClick={() => removePatient(p)}
                >
                  {deletingId === p.id ? "Removing…" : "Remove patient"}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {!loading && patients.length === 0 && <p className="mt-4 text-sm text-ink-muted">No patients yet.</p>}
    </div>
  );
}
