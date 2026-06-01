import Link from "next/link";
import { Card } from "@/components/ui";
import { getSession } from "@/lib/session";
import { patientAppIncludes } from "@/lib/patient-app-includes";
import { getPracticeWebsiteUrl } from "@/lib/practice-website-url";

export default async function PortalHomePage() {
  const SITE = getPracticeWebsiteUrl();
  const session = await getSession();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">
        Welcome{session?.name ? `, ${session.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-2 text-ink-muted">
        Appointments, secure messaging, shared documents, recovery information, and practice contact details — in one place.
      </p>

      <Card className="mt-8 border-teal/15 bg-white/80">
        <h2 className="font-serif text-lg font-semibold text-teal">What the app includes</h2>
        <ul className="mt-4 space-y-3 text-sm text-ink-muted">
          {patientAppIncludes.map((item) => (
            <li key={item.title}>
              <strong className="text-ink">{item.title}</strong>
              {item.description ? (
                <span className="text-ink-muted"> — {item.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/portal/appointments">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Appointments</h2>
            <p className="mt-2 text-sm text-ink-muted">Request or review your visits at Cadogan Clinic or Shirley Oaks.</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/messages">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Messages</h2>
            <p className="mt-2 text-sm text-ink-muted">Non-urgent questions for the practice team. Not for emergencies.</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/images">
          <Card className="h-full border-gold/30 bg-gold/[0.04] transition hover:border-gold/50 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Upload a photo</h2>
            <p className="mt-2 text-sm text-ink-muted">Share an image with the clinic team.</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Upload →</span>
          </Card>
        </Link>
        <Link href="/portal/documents">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Documents</h2>
            <p className="mt-2 text-sm text-ink-muted">Letters and resources shared by the clinic (secure links).</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/care">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Care & information</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Recovery guides, checklists, FAQs, and trusted links — including step-by-step timelines.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/contact">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Contact & locations</h2>
            <p className="mt-2 text-sm text-ink-muted">Clinic addresses, phone numbers, and external booking links.</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
      </div>

      <Card className="mt-10 border-teal/20 bg-teal/[0.03]">
        <p className="text-sm text-ink-muted">
          <strong className="text-ink">Clinical note:</strong> This portal supports coordination and education. It does not replace
          medical advice. Always follow the instructions on your discharge letter and call the appropriate emergency number if you are
          unwell.
        </p>
        <a
          href={SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-teal hover:underline"
        >
          Visit the main practice website →
        </a>
      </Card>
    </div>
  );
}
