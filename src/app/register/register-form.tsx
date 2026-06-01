"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite")?.trim() ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inviteToken) return;
    fetch(`/api/invites/${encodeURIComponent(inviteToken)}`)
      .then((r) => r.json())
      .then((d: { valid?: boolean; email?: string; name?: string | null }) => {
        if (d.valid && d.email) {
          setEmail(d.email);
          if (d.name) setName(d.name);
        }
      })
      .catch(() => {});
  }, [inviteToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || undefined,
          inviteToken: inviteToken || undefined,
          privacyAccepted: privacyAccepted ? true : undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; redirect?: string };
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push(data.redirect ?? "/portal");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      {inviteToken ? (
        <p className="mb-4 text-sm text-ink-muted">You are registering with a practice invitation.</p>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            readOnly={Boolean(inviteToken && email)}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            className="mt-1"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            required
          />
          <span>
            I have read the{" "}
            <Link href="/privacy" className="text-teal hover:underline" target="_blank">
              privacy notice
            </Link>{" "}
            and agree to the practice holding my portal data for care coordination.
          </span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !privacyAccepted}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </Card>
  );
}

export function RegisterForm() {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-muted">Loading…</p>}>
      <RegisterFormInner />
    </Suspense>
  );
}
