"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Label, TextArea } from "@/components/ui";

type Appt = {
  id: string;
  location: string;
  type: string;
  requestedAt: string;
  notes: string | null;
  status: string;
  staffNotes: string | null;
};

export function AppointmentsClient() {
  const [list, setList] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Cadogan Clinic, Chelsea");
  const [type, setType] = useState("");
  const [requestedAt, setRequestedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/appointments");
    const data = (await res.json()) as { appointments?: Appt[] };
    setList(data.appointments ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!requestedAt || !type.trim()) {
      setMsg("Please choose date/time and appointment type.");
      return;
    }
    setSubmitting(true);
    try {
      const iso = new Date(requestedAt).toISOString();
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, type: type.trim(), requestedAt: iso, notes: notes.trim() || undefined }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setMsg(err.error ?? "Could not submit");
        return;
      }
      setType("");
      setNotes("");
      setRequestedAt("");
      setMsg("Request sent. The clinic will confirm shortly.");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function cancel(id: string) {
    if (!confirm("Cancel this appointment request?")) return;
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <h2 className="font-serif text-lg font-semibold text-teal">New request</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <Label>Location</Label>
            <select
              className="mt-1 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option>Cadogan Clinic, Chelsea</option>
              <option>Shirley Oaks Hospital, Surrey</option>
            </select>
          </div>
          <div>
            <Label htmlFor="type">Type of visit</Label>
            <Input
              id="type"
              placeholder="e.g. Initial consultation, follow-up, One Stop Clinic"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="when">Preferred date & time</Label>
            <Input
              id="when"
              type="datetime-local"
              value={requestedAt}
              onChange={(e) => setRequestedAt(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <TextArea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {msg && <p className="text-sm text-ink-muted">{msg}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">Your appointments</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-muted">Loading…</p>
        ) : list.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No appointments yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {list.map((a) => (
              <Card key={a.id} className="!p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{a.type}</p>
                    <p className="text-sm text-ink-muted">{a.location}</p>
                    <p className="text-sm text-ink-muted">
                      {new Date(a.requestedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    {a.notes && <p className="mt-2 text-sm text-ink-muted">Your note: {a.notes}</p>}
                    {a.staffNotes && (
                      <p className="mt-2 rounded-md bg-cream-dark p-2 text-sm text-ink">From clinic: {a.staffNotes}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                      a.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : a.status === "CANCELLED"
                          ? "bg-stone-200 text-stone-600"
                          : a.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {a.status.toLowerCase()}
                  </span>
                </div>
                {(a.status === "REQUESTED" || a.status === "CONFIRMED") && (
                  <Button type="button" variant="ghost" className="mt-3 !px-0 text-red-600" onClick={() => cancel(a.id)}>
                    Cancel request
                  </Button>
                )}

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
          </ul>
        )}
      </div>
    </div>
  );
}
