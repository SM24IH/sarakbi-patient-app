import Link from "next/link";
import { Card } from "@/components/ui";
import { getSession } from "@/lib/session";
import { patientAppIncludes } from "@/lib/patient-app-includes";
import { getPublicSiteUrl } from "@/lib/site-url";

export default async function PortalHomePage() {
  const SITE = getPublicSiteUrl();
  const session = await getSession();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">
        Welcome{session?.name ? `, ${session.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-2 text-ink-muted">
        Recovery guides, reminders, documents from the team, post-operative advice, FAQs, and messaging — alongside booking and clinic
        information.
      </p>

      <Card className="mt-8 border-teal/15 bg-white/80">
        <h2 className="font-serif text-lg font-semibold text-teal">What the app includes</h2>
        <ul className="mt-4 space-y-3 text-sm text-ink-muted">
          {patientAppIncludes.map((item) => (
            <li key={item.title}>
              <strong className="text-ink">{item.title}</strong>
              <span className="text-ink-muted"> — {item.description}</span>
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
        <Link href="/portal/documents">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Documents</h2>
            <p className="mt-2 text-sm text-ink-muted">Letters and resources shared by the clinic (secure links).</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/recovery-guides">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Recovery guides</h2>
            <p className="mt-2 text-sm text-ink-muted">Step-by-step timelines with activity milestones.</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Open →</span>
          </Card>
        </Link>
        <Link href="/portal/care">
          <Card className="h-full transition hover:border-teal/30 hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-teal">Care & information</h2>
            <p className="mt-2 text-sm text-ink-muted">Checklists, what to expect, and links to trusted resources.</p>
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
