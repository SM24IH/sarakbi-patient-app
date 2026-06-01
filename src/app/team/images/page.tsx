import { Suspense } from "react";
import { TeamImagesClient } from "./team-images-client";

export default function TeamImagesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Patient photos</h1>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-ink-muted">Loading…</p>}>
          <TeamImagesClient />
        </Suspense>
      </div>
    </div>
  );
}
