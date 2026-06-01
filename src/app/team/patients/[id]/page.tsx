import { PatientDetailClient } from "./patient-detail-client";

type Props = { params: Promise<{ id: string }> };

export default async function TeamPatientDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl">
      <PatientDetailClient patientId={id} />
    </div>
  );
}
