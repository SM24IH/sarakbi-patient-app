"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { categoryLabel } from "@/lib/message-categories";

type Thread = {
  id: string;
  subject: string;
  category: string | null;
  updatedAt: string;
  patient: { name: string; email: string };
  messages: Array<{ body: string; createdAt: string; sender: { name: string; role: string } }>;
};

export default function TeamMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/messages/threads");
    const data = (await res.json()) as { threads?: Thread[] };
    setThreads(data.threads ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Inbox</h1>
      <p className="mt-2 text-sm text-ink-muted">All patient conversations.</p>
      <ul className="mt-8 space-y-2">
        {threads.map((t) => {
          const last = t.messages[0];
          return (
            <li key={t.id}>
              <Link href={`/team/messages/${t.id}`}>
                <Card className="!p-4 transition hover:border-teal/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">{categoryLabel(t.category)}</p>
                  <p className="mt-1 font-medium text-ink">{t.subject}</p>
                  <p className="text-xs text-ink-muted">
                    {t.patient.name} · {t.patient.email}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{last?.body}</p>
                  <p className="mt-2 text-xs text-stone-400">
                    Updated {new Date(t.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
      {threads.length === 0 && <p className="mt-4 text-sm text-ink-muted">No threads yet.</p>}
    </div>
  );
}
