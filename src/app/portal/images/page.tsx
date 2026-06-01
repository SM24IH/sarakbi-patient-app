import { PatientImagesClient } from "./images-client";

export default function PatientImagesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Photos</h1>
      <PatientImagesClient />
    </div>
  );
}
