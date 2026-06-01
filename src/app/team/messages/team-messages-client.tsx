"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Label, TextArea } from "@/components/ui";
import { categoryLabel, MESSAGE_THREAD_CATEGORIES, type MessageThreadCategory } from "@/lib/message-categories";

type Patient = { id: string; name: string; email: string };

type Thread = {
  id: string;
  subject: string;
  category: string | null;
  updatedAt: string;
  unreadCount?: number;
  patient: { name: string; email: string };
  messages: Array<{ body: string; sender: { role: string } }>;
};

export function TeamMessagesClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<MessageThreadCategory>("OTHER");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [tRes, pRes] = await Promise.all([fetch("/api/messages/threads"), fetch("/api/patients")]);
    const tData = (await tRes.json()) as { threads?: Thread[] };
    const pData = (await pRes.json()) as { patients?: Patient[] };
    setThreads(tData.threads ?? []);
    setPatients(pData.patients ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function sendToPatient(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, subject, body, category }),
    });
    const data = (await res.json()) as { error?: string; threadId?: string };
    if (!res.ok) {
      setMsg(data.error ?? "Could not send.");
      return;
    }
    setShowCompose(false);
    setSubject("");
    setBody("");
    setPatientId("");
    await load();
    if (data.threadId) window.location.href = `/team/messages/${data.threadId}`;
  }

  if (loading) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Inbox</h1>
          <p className="mt-2 text-sm text-ink-muted">Patient conversations — unread items are highlighted.</p>
        </div>
        <Button type="button" onClick={() => setShowCompose((v) => !v)}>
          {showCompose ? "Cancel" : "Message a patient"}
        </Button>
      </div>

      {showCompose ? (
        <Card className="mt-6 !p-6">
          <h2 className="font-serif text-lg font-semibold text-teal">New message to patient</h2>
          <form onSubmit={sendToPatient} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <select
                id="patient"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select patient…</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="cat">Topic</Label>
              <select
                id="cat"
                className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as MessageThreadCategory)}
              >
                {MESSAGE_THREAD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="subj">Subject</Label>
              <Input id="subj" required value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <TextArea id="body" rows={4} required value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            {msg && <p className="text-sm text-red-600">{msg}</p>}
            <Button type="submit">Send</Button>
          </form>
        </Card>
      ) : null}

      <ul className="mt-8 space-y-2">
        {threads.map((t) => {
          const last = t.messages[0];
          const unread = (t.unreadCount ?? 0) > 0;
          return (
            <li key={t.id}>
              <Link href={`/team/messages/${t.id}`}>
                <Card
                  className={`!p-4 transition hover:border-teal/40 ${unread ? "border-teal/40 bg-teal/[0.04]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                      {categoryLabel(t.category)}
                    </p>
                    {unread ? (
                      <span className="rounded-full bg-teal px-2 py-0.5 text-xs font-semibold text-white">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-medium text-ink">{t.subject}</p>
                  <p className="text-xs text-ink-muted">
                    {t.patient.name} · {t.patient.email}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{last?.body}</p>
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
