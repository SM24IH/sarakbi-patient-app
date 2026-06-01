import Link from "next/link";
import { Card } from "@/components/ui";
import { getPracticeWebsiteUrl } from "@/lib/practice-website-url";

export default function ContactPage() {
  const SITE = getPracticeWebsiteUrl();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Contact & locations</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Reception numbers and opening hours are on the main website. For non-urgent clinical questions, use{" "}
        <Link href="/portal/messages" className="text-teal hover:underline">
          secure messaging
        </Link>
        .
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="font-serif text-xl font-semibold text-teal">Cadogan Clinic, Chelsea</h2>
          <p className="mt-2 text-sm text-ink-muted">120 Sloane Street, London SW1X 9BW</p>
          <p className="mt-4 text-sm">
            <a
              href={`${SITE}/contact/`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal hover:underline"
            >
              Phone numbers and directions →
            </a>
          </p>
        </Card>
        <Card>
          <h2 className="font-serif text-xl font-semibold text-teal">Shirley Oaks Hospital, Surrey</h2>
          <p className="mt-2 text-sm text-ink-muted">One Stop Clinic & breast cancer services</p>
          <p className="mt-4 text-sm">
            <a
              href={`${SITE}/contact/`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal hover:underline"
            >
              Phone numbers and directions →
            </a>
          </p>
        </Card>
        <Card>
          <h2 className="font-serif text-xl font-semibold text-teal">Professional registration</h2>
          <p className="mt-2 text-sm text-ink-muted">
            GMC: 6027127 —{" "}
            <a
              href="https://www.gmc-uk.org/doctors/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline"
            >
              Verify on the GMC register
            </a>
          </p>
        </Card>
        <a
          href={`${SITE}/contact/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-gold hover:underline"
        >
          Open web contact form →
        </a>
      </div>
    </div>
  );
}
