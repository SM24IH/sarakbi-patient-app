import { TeamDocumentsClient } from "./team-documents-client";

export default function TeamDocumentsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Documents</h1>
      <p className="mt-2 text-sm text-ink-muted">Share https links to letters or resources; patients see them in their portal and app.</p>
      <div className="mt-8">
        <TeamDocumentsClient />
      </div>
    </div>
  );
}
