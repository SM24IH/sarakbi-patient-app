import { PatientImagesClient } from "./images-client";

export default function PatientImagesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Photos</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Upload images for the clinic team to review — for example wound checks after surgery. Only you and authorised staff
        can view them.
      </p>
      <PatientImagesClient />
    </div>
  );
}
