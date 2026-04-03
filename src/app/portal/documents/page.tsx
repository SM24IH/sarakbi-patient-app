import { PatientDocumentsClient } from "./documents-client";

export default function PatientDocumentsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Documents</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Letters and resources shared by the clinic open in a new tab (secure https links). If something looks wrong, message the team
        or call the urgent line in your discharge pack.
      </p>
      <PatientDocumentsClient />
    </div>
  );
}
