import Link from "next/link";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function TeamHomePage() {
  const [pendingAppts, openThreads] = await Promise.all([
    prisma.appointment.count({ where: { status: "REQUESTED" } }),
    prisma.messageThread.count(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Clinic overview</h1>
      <p className="mt-2 text-sm text-ink-muted">Quick snapshot of booking requests and message threads.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-ink-muted">Pending appointment requests</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-teal">{pendingAppts}</p>
          <Link href="/team/appointments" className="mt-4 inline-block text-sm text-gold hover:underline">
            Manage appointments →
          </Link>
        </Card>
        <Card>
          <p className="text-sm font-medium text-ink-muted">Message threads</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-teal">{openThreads}</p>
          <Link href="/team/messages" className="mt-4 inline-block text-sm text-gold hover:underline">
            Open inbox →
          </Link>
        </Card>
      </div>

      <Card className="mt-8 border-amber-200 bg-amber-50/80">
        <p className="text-sm text-amber-950">
          <strong>Compliance:</strong> For real patient data, add audit logging, NHS DSPT / UK GDPR measures, clinical safety review, and
          integration with your practice management system. This build is a functional prototype.
        </p>
      </Card>
    </div>
  );
}
