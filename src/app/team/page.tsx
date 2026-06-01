import Link from "next/link";
import { Card } from "@/components/ui";
import { TeamOverviewStats } from "./team-overview-stats";

export default function TeamHomePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Clinic overview</h1>
      <p className="mt-2 text-sm text-ink-muted">Messages, appointments, and patient photos at a glance.</p>

      <TeamOverviewStats />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/team/invites">
          <Card className="h-full transition hover:border-teal/30">
            <h2 className="font-serif text-lg font-semibold text-teal">Invite patients</h2>
            <p className="mt-2 text-sm text-ink-muted">Email a registration link to new portal users.</p>
          </Card>
        </Link>
        <Link href="/team/patients">
          <Card className="h-full transition hover:border-teal/30">
            <h2 className="font-serif text-lg font-semibold text-teal">Patient directory</h2>
            <p className="mt-2 text-sm text-ink-muted">View records, message, or remove accounts.</p>
          </Card>
        </Link>
      </div>

      <Card className="mt-8 border-amber-200 bg-amber-50/80">
        <p className="text-sm text-amber-950">
          <strong>Compliance:</strong> Privacy notice at{" "}
          <Link href="/privacy" className="underline">
            /privacy
          </Link>
          . For regulated clinical data, add audit logging, DSPT measures, and PMS integration as your practice
          requires.
        </p>
      </Card>
    </div>
  );
}
