"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, TextArea } from "@/components/ui";

type Appt = {
  id: string;
  location: string;
  type: string;
  requestedAt: string;
  notes: string | null;
  status: string;
  staffNotes: string | null;
  patient: { id: string; name: string; email: string; phone: string | null };
};

export function TeamAppointmentsClient() {
  const [list, setList] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/appointments");
    const data = (await res.json()) as { appointments?: Appt[] };
    setList(data.appointments ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, body: object) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
  }

  if (loading) return <p className="mt-8 text-sm text-ink-muted">Loading…</p>;

  return (
    <ul className="mt-8 space-y-4">
      {list.map((a) => (
        <Card key={a.id} className="!p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-ink">
                {a.patient.name} · {a.patient.email}
              </p>
              {a.patient.phone && <p className="text-sm text-ink-muted">{a.patient.phone}</p>}
              <p className="mt-2 font-medium text-teal">{a.type}</p>
              <p className="text-sm text-ink-muted">{a.location}</p>
              <p className="text-sm text-ink-muted">
                {new Date(a.requestedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
              {a.notes && <p className="mt-2 text-sm text-ink-muted">Patient note: {a.notes}</p>}
            </div>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold uppercase text-stone-700">{a.status}</span>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Staff notes (visible to patient)</label>
            <TextArea
              className="mt-1"
              rows={2}
              value={editingNotes[a.id] ?? a.staffNotes ?? ""}
              onChange={(e) => setEditingNotes((prev) => ({ ...prev, [a.id]: e.target.value }))}
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() => patch(a.id, { staffNotes: editingNotes[a.id] ?? a.staffNotes ?? "" })}
            >
              Save notes
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {a.status === "REQUESTED" && (
              <>
                <Button type="button" onClick={() => patch(a.id, { status: "CONFIRMED", confirmedAt: new Date().toISOString() })}>
                  Confirm
                </Button>
                <Button type="button" variant="secondary" onClick={() => patch(a.id, { status: "CANCELLED" })}>
                  Decline
                </Button>
              </>
            )}
            {a.status === "CONFIRMED" && (
              <Button type="button" variant="secondary" onClick={() => patch(a.id, { status: "COMPLETED" })}>
                Mark completed
              </Button>
            )}
          </div>

          {(a.status === "REQUESTED" || a.status === "CONFIRMED") && (
            <div className="mt-3">
              <a
                href={`/api/appointments/${a.id}/ics`}
                className="inline-flex items-center rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-teal hover:bg-cream-dark"
              >
                <span className="mr-2">+</span> Add to calendar
              </a>
            </div>
          )}
        </Card>
      ))}
      {list.length === 0 && <p className="text-sm text-ink-muted">No appointments.</p>}
    </ul>
  );
}
