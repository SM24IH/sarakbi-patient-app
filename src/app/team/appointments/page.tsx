import { TeamAppointmentsClient } from "./team-appointments-client";

export default function TeamAppointmentsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Appointments</h1>
      <p className="mt-2 text-sm text-ink-muted">Confirm, complete, or add internal notes visible to patients where appropriate.</p>
      <TeamAppointmentsClient />
    </div>
  );
}
