"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Label, TextArea } from "@/components/ui";

type Patient = { id: string; name: string; email: string };

type Doc = {
  id: string;
  title: string;
  documentUrl: string;
  notes: string | null;
  createdAt: string;
  patient: Patient;
  createdBy: { name: string };
};

export function TeamDocumentsClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    const res = await fetch("/api/patients");
    const data = (await res.json()) as { patients?: Patient[] };
    setPatients(data.patients ?? []);
  }, []);

  const loadDocuments = useCallback(async () => {
    const res = await fetch("/api/documents");
    const data = (await res.json()) as { documents?: Doc[] };
    setDocuments(data.documents ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadPatients();
      await loadDocuments();
      setLoading(false);
    })();
  }, [loadPatients, loadDocuments]);

  async function addDoc(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        title,
        documentUrl,
        notes: notes.trim() || undefined,
      }),
    });
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMsg(err.error ?? "Could not save.");
      return;
    }
    setTitle("");
    setDocumentUrl("");
    setNotes("");
    setMsg("Saved.");
    await loadDocuments();
  }

  async function remove(id: string) {
    if (!confirm("Remove this document link for the patient?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setMsg("Could not delete.");
      return;
    }
    setMsg(null);
    await loadDocuments();
  }

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="space-y-8">
      <Card className="!p-6">
        <h2 className="font-serif text-xl font-semibold text-teal">Share a document link</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Paste a stable <strong className="text-ink">https://</strong> URL (e.g. hosted PDF or patient information page). File upload is
          not included in this version.
        </p>
        <form onSubmit={addDoc} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="pid">Patient</Label>
            <select
              id="pid"
              required
              className="mt-1 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Select…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Clinic letter 12 Mar" />
          </div>
          <div>
            <Label htmlFor="url">Document URL (https)</Label>
            <Input
              id="url"
              type="url"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              required
              placeholder="https://…"
            />
          </div>
          <div>
            <Label htmlFor="notes">Optional note to patient</Label>
            <TextArea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {msg && <p className={`text-sm ${msg === "Saved." ? "text-green-700" : "text-red-600"}`}>{msg}</p>}
          <Button type="submit">Add for patient</Button>
        </form>
      </Card>

      <div>
        <h2 className="font-serif text-xl font-semibold text-ink">All shared links</h2>
        <ul className="mt-4 space-y-2">
          {documents.map((d) => (
            <li key={d.id}>
              <Card className="!p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{d.title}</p>
                    <p className="text-xs text-ink-muted">
                      {d.patient.name} · {d.patient.email}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      By {d.createdBy.name} · {new Date(d.createdAt).toLocaleString()}
                    </p>
                    <a
                      href={d.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-teal hover:underline"
                    >
                      {d.documentUrl}
                    </a>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:underline"
                    onClick={() => remove(d.id)}
                  >
                    Remove
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        {documents.length === 0 && <p className="mt-4 text-sm text-ink-muted">No documents shared yet.</p>}
      </div>
    </div>
  );
}
