"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui";

type Doc = {
  id: string;
  title: string;
  documentUrl: string;
  notes: string | null;
  createdAt: string;
  createdBy: { name: string };
};

export function PatientDocumentsClient() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/documents");
    if (!res.ok) {
      setError("Could not load documents.");
      setDocuments([]);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { documents?: Doc[] };
    setDocuments(data.documents ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="mt-6 text-sm text-ink-muted">Loading…</p>;
  if (error) return <p className="mt-6 text-sm text-red-600">{error}</p>;

  if (documents.length === 0) {
    return (
      <Card className="mt-6 !p-6">
        <p className="text-sm text-ink-muted">
          No documents yet. When the clinic shares a letter or link with you, it will appear here.
        </p>
      </Card>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {documents.map((d) => (
        <li key={d.id}>
          <Card className="!p-5">
            <h2 className="font-serif text-lg font-semibold text-teal">{d.title}</h2>
            <p className="mt-1 text-xs text-ink-muted">
              Added {new Date(d.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })} · {d.createdBy.name}
            </p>
            {d.notes ? <p className="mt-2 text-sm text-ink-muted">{d.notes}</p> : null}
            <a
              href={d.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-gold hover:underline"
            >
              Open document →
            </a>
          </Card>
        </li>
      ))}
    </ul>
  );
}
