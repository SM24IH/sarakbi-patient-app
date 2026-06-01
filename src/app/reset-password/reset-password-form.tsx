"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

function ResetPasswordFormInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not reset password.");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card className="mt-8 !p-6">
        <p className="text-sm text-ink-muted">Your password has been updated.</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-teal hover:underline">
          Sign in →
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !token}>
          {loading ? "Saving…" : "Set new password"}
        </Button>
      </form>
    </Card>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-muted">Loading…</p>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
