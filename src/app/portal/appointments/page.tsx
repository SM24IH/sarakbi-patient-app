import { AppointmentsClient } from "./appointments-client";

export default function PatientAppointmentsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Appointments</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Submit a request with your preferred date and time. The team will confirm or suggest alternatives.
      </p>
      <AppointmentsClient />
    </div>
  );
}
