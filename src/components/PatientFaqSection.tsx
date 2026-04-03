import { patientFaqItems } from "@/lib/patient-faq";
import { Card } from "@/components/ui";

export function PatientFaqSection() {
  return (
    <Card className="!p-6">
      <h2 className="font-serif text-xl font-semibold text-teal">Common questions (recovery)</h2>
      <p className="mt-2 text-sm text-ink-muted">
        General guidance only — your personalised discharge letter and clinic advice always take priority.
      </p>
      <dl className="mt-6 space-y-6">
        {patientFaqItems.map((item) => (
          <div key={item.q}>
            <dt className="font-medium text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm text-ink-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
