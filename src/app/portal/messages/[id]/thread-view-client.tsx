"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { Button, Card, TextArea } from "@/components/ui";
import { categoryLabel } from "@/lib/message-categories";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: { name: string; role: string };
};

type Thread = {
  id: string;
  subject: string;
  category: string | null;
  patientId?: string;
  patient?: { name: string; email: string };
  messages: Message[];
};

export function ThreadViewClient({
  params,
  basePath,
}: {
  params: Promise<{ id: string }>;
  basePath: string;
}) {
  const { id } = use(params);
  const [thread, setThread] = useState<Thread | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/messages/threads/${id}`);
    if (!res.ok) {
      setThread(null);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { thread: Thread };
    setThread(data.thread);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await fetch(`/api/messages/threads/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setBody("");
    await load();
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }
  if (!thread) {
    return <p className="text-sm text-red-600">Conversation not found.</p>;
  }

  return (
    <div>
      <Link href={basePath} className="text-sm text-teal hover:underline">
        ← Back
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal">{categoryLabel(thread.category)}</p>
      <h1 className="mt-1 font-serif text-2xl font-semibold text-ink">{thread.subject}</h1>
      {thread.patient && (
        <p className="mt-1 text-sm text-ink-muted">
          Patient: {thread.patient.name} · {thread.patient.email}
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {thread.messages.map((m) => (
          <li key={m.id} className={`flex ${m.sender.role === "STAFF" ? "justify-start" : "justify-end"}`}>
            <Card
              className={`max-w-[90%] !p-4 sm:max-w-[80%] ${
                m.sender.role === "STAFF" ? "border-teal/20 bg-white" : "border-gold/30 bg-cream-dark/50"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {m.sender.name} · {m.sender.role === "STAFF" ? "Clinic" : "You"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{m.body}</p>
              <p className="mt-2 text-xs text-stone-400">
                {new Date(m.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </Card>
          </li>
        ))}
      </ul>

      <form onSubmit={send} className="mt-8 space-y-3">
        <TextArea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a reply…" required />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
