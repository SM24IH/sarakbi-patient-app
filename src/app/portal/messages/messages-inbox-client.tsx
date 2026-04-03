"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Label, TextArea } from "@/components/ui";
import { categoryLabel, MESSAGE_THREAD_CATEGORIES, type MessageThreadCategory } from "@/lib/message-categories";

type Thread = {
  id: string;
  subject: string;
  category: string | null;
  updatedAt: string;
  messages: Array<{
    body: string;
    createdAt: string;
    sender: { name: string; role: string };
  }>;
};

export function MessagesInboxClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<MessageThreadCategory>("APPOINTMENT");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/messages/threads");
    const data = (await res.json()) as { threads?: Thread[] };
    setThreads(data.threads ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createThread(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, category }),
    });
    if (!res.ok) {
      setMsg("Could not start conversation.");
      return;
    }
    const data = (await res.json()) as { threadId?: string };
    setSubject("");
    setBody("");
    await load();
    if (data.threadId) {
      window.location.href = `/portal/messages/${data.threadId}`;
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <h2 className="font-serif text-lg font-semibold text-teal">New conversation</h2>
        <form onSubmit={createThread} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="cat">Topic</Label>
            <select
              id="cat"
              className="mt-1 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              value={category}
              onChange={(e) => setCategory(e.target.value as MessageThreadCategory)}
            >
              {MESSAGE_THREAD_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-muted">{MESSAGE_THREAD_CATEGORIES.find((c) => c.value === category)?.hint}</p>
          </div>
          <div>
            <Label htmlFor="subj">Subject</Label>
            <Input id="subj" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="body">Message</Label>
            <TextArea id="body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <Button type="submit">Send to clinic</Button>
        </form>
      </Card>

      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">Inbox</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-muted">Loading…</p>
        ) : threads.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No messages yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {threads.map((t) => {
              const last = t.messages[0];
              return (
                <li key={t.id}>
                  <Link href={`/portal/messages/${t.id}`}>
                    <Card className="!p-4 transition hover:border-teal/40">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal">{categoryLabel(t.category)}</p>
                      <p className="mt-1 font-medium text-ink">{t.subject}</p>
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
        )}
      </div>
    </div>
  );
}
