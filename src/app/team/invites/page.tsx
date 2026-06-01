"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

type Invite = {
  id: string;
  email: string;
  name: string | null;
  usedAt: string | null;
  expiresAt: string;
  createdAt: string;
  createdBy: { name: string };
};

export default function TeamInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/invites");
    const data = (await res.json()) as { invites?: Invite[] };
    setInvites(data.invites ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name.trim() || undefined }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setMsg(data.error ?? "Could not send invite.");
      return;
    }
    setEmail("");
    setName("");
    setMsg("Invitation email sent.");
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Invite patients</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Send a registration link by email. Required when public registration is turned off.
      </p>

      <Card className="mt-8 !p-6">
        <form onSubmit={sendInvite} className="space-y-4">
          <div>
            <Label htmlFor="invite-email">Patient email</Label>
            <Input id="invite-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="invite-name">Name (optional)</Label>
            <Input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {msg && <p className="text-sm text-ink-muted">{msg}</p>}
          <Button type="submit">Send invitation</Button>
        </form>
      </Card>

      <h2 className="mt-10 font-serif text-lg font-semibold text-teal">Recent invitations</h2>
      {loading ? (
        <p className="mt-4 text-sm text-ink-muted">Loading…</p>
      ) : invites.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No invitations yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {invites.map((inv) => (
            <li key={inv.id}>
              <Card className="!p-4 text-sm">
                <p className="font-medium text-ink">{inv.email}</p>
                {inv.name ? <p className="text-ink-muted">{inv.name}</p> : null}
                <p className="mt-1 text-xs text-stone-500">
                  {inv.usedAt
                    ? `Used ${new Date(inv.usedAt).toLocaleDateString()}`
                    : `Expires ${new Date(inv.expiresAt).toLocaleDateString()}`}{" "}
                  · sent by {inv.createdBy.name}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
