import Link from "next/link";
import { PatientFaqSection } from "@/components/PatientFaqSection";
import { UrgentCareCard } from "@/components/UrgentCareCard";
import { Card } from "@/components/ui";
import { patientAppIncludes } from "@/lib/patient-app-includes";
import { getPracticeWebsiteUrl } from "@/lib/practice-website-url";

const checklistPre = [
  "Bring a list of current medications and allergies.",
  "Arrange an adult to collect you if you are having a procedure with sedation or anaesthetic.",
  "Wear comfortable, loose clothing; avoid jewellery if instructed.",
  "Follow fasting instructions exactly if provided for your appointment type.",
];

const checklistPost = [
  "Rest as advised and take pain relief only as prescribed or agreed with your team.",
  "Keep dressings clean and dry unless you have been given different instructions.",
  "Watch for signs of infection or concern outlined in your discharge letter — seek help if they occur.",
  "Attend follow-up appointments and use this app for non-urgent questions.",
];

export default function CarePage() {
  const SITE = getPracticeWebsiteUrl();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Care & information</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Practical reminders aligned with a typical pathway. Your personalised instructions from the clinic always take precedence.
      </p>

      <div className="mt-8">
        <UrgentCareCard variant="full" />
      </div>

      <Card className="mt-8 border-teal/15 bg-white/80">
        <h2 className="font-serif text-lg font-semibold text-teal">Recovery guides</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Step-by-step timelines and milestones for your pathway — open the in-portal guides.
        </p>
        <Link
          href="/portal/recovery-guides"
          className="mt-4 inline-block text-sm font-medium text-gold hover:underline"
        >
          Open recovery guides →
        </Link>
      </Card>

      <Card className="mt-8 border-teal/15">
        <h2 className="font-serif text-xl font-semibold text-teal">What the app includes</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {patientAppIncludes.map((item) => (
            <li key={item.title}>
              <strong className="text-ink">{item.title}</strong> — {item.description}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-teal">Your journey (overview)</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink-muted">
          <li>
            <strong className="text-ink">Book a consultation</strong> — at Cadogan Clinic, Chelsea or Shirley Oaks Hospital, Surrey.
          </li>
          <li>
            <strong className="text-ink">Consultation & imaging</strong> — the One Stop Clinic can combine consultation and diagnostic imaging
            where appropriate.
          </li>
          <li>
            <strong className="text-ink">Your treatment plan</strong> — shared decision-making with clear options.
          </li>
          <li>
            <strong className="text-ink">Surgery & aftercare</strong> — structured follow-up; use this portal for coordination between visits.
          </li>
        </ol>
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <h3 className="font-serif text-lg font-semibold text-ink">Before your visit</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
            {checklistPre.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-serif text-lg font-semibold text-ink">After your procedure</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
            {checklistPost.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <PatientFaqSection />
      </div>

      <Card className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-teal">Trusted links</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a href={SITE} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Main practice website — breast cancer, cosmetic surgery, benign conditions
            </a>
          </li>
          <li>
            <a href={`${SITE}/patient-information/`} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Patient information
            </a>
          </li>
          <li>
            <a href={`${SITE}/recovery-guides/`} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Recovery guides
            </a>
          </li>
          <li>
            <a href={`${SITE}/gallery/`} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Gallery (age-restricted)
            </a>
          </li>
        </ul>
      </Card>
    </div>
  );
}
