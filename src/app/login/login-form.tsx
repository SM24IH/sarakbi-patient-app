"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configError = searchParams.get("error") === "config";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string; redirect?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed");
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
      {configError && (
        <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          Server configuration incomplete. Add <code className="text-xs">SESSION_SECRET</code> (16+ characters) to{" "}
          <code className="text-xs">.env</code>.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/forgot-password" className="text-teal hover:underline">
          Forgot password?
        </Link>
      </p>
    </Card>
  );
}
