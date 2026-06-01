"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui";

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

  const load = useCallback(async () => {
    const res = await fetch("/api/patients");
    const data = (await res.json()) as { patients?: Patient[] };
    setPatients(data.patients ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Patients</h1>
      <p className="mt-2 text-sm text-ink-muted">Patients who have a portal account.</p>
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
                <Link href="/team/messages" className="mt-2 inline-block text-sm text-teal hover:underline">
                  Open inbox →
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {!loading && patients.length === 0 && <p className="mt-4 text-sm text-ink-muted">No patients yet.</p>}
    </div>
  );
}
