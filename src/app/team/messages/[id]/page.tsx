import { ThreadViewClient } from "@/app/portal/messages/[id]/thread-view-client";

export default function TeamThreadPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto max-w-2xl">
      <ThreadViewClient params={params} basePath="/team/messages" />
    </div>
  );
}
