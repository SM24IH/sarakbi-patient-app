import { UrgentCareCard } from "@/components/UrgentCareCard";
import { MessagesInboxClient } from "./messages-inbox-client";

export default function PatientMessagesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Messages</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Use for non-urgent questions. The team aims to respond within one working day. Pick a topic so we can route your message faster.
      </p>
      <div className="mt-6">
        <UrgentCareCard variant="compact" />
      </div>
      <MessagesInboxClient />
    </div>
  );
}
