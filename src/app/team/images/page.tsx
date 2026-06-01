import { TeamImagesClient } from "./team-images-client";

export default function TeamImagesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Patient photos</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Images uploaded by patients from their portal. Review here and follow up via messages if needed.
      </p>
      <div className="mt-8">
        <TeamImagesClient />
      </div>
    </div>
  );
}
