"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMsg("If an account exists for that email, we sent a reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {msg && <p className="text-sm text-ink-muted">{msg}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-teal hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
