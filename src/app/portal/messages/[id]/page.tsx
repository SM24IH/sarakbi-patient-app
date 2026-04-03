import { ThreadViewClient } from "./thread-view-client";

export default function PatientThreadPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto max-w-2xl">
      <ThreadViewClient params={params} basePath="/portal/messages" />
    </div>
  );
}
