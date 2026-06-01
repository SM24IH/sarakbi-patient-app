"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

export function TeamOverviewStats() {
  const [stats, setStats] = useState({
    unreadMessages: 0,
    pendingAppointments: 0,
    recentPhotos: 0,
  });

  useEffect(() => {
    fetch("/api/team/stats")
      .then((r) => r.json())
      .then((d: typeof stats) => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-sm font-medium text-ink-muted">Unread patient messages</p>
        <p className="mt-2 font-serif text-4xl font-semibold text-teal">{stats.unreadMessages}</p>
        <Link href="/team/messages" className="mt-4 inline-block text-sm text-gold hover:underline">
          Open inbox →
        </Link>
      </Card>
      <Card>
        <p className="text-sm font-medium text-ink-muted">Pending appointments</p>
        <p className="mt-2 font-serif text-4xl font-semibold text-teal">{stats.pendingAppointments}</p>
        <Link href="/team/appointments" className="mt-4 inline-block text-sm text-gold hover:underline">
          Manage →
        </Link>
      </Card>
      <Card>
        <p className="text-sm font-medium text-ink-muted">Photos (last 7 days)</p>
        <p className="mt-2 font-serif text-4xl font-semibold text-teal">{stats.recentPhotos}</p>
        <Link href="/team/images" className="mt-4 inline-block text-sm text-gold hover:underline">
          Review photos →
        </Link>
      </Card>
    </div>
  );
}
