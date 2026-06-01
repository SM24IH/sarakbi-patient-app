import { getPracticeWebsiteUrl } from "@/lib/practice-website-url";
import Link from "next/link";

export default function PrivacyPage() {
  const site = getPracticeWebsiteUrl();
  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <article className="mx-auto max-w-2xl prose prose-stone">
        <h1 className="font-serif text-3xl font-semibold text-ink">Privacy notice</h1>
        <p className="text-sm text-ink-muted">Patient portal · Mr Will Sarakbi</p>

        <section className="mt-8 space-y-4 text-sm text-ink-muted">
          <p>
            This portal is operated by Mr Will Sarakbi&apos;s private practice to support your care between visits. It
            handles personal and health-related information you choose to share (messages, photos, appointments).
          </p>
          <h2 className="font-serif text-lg font-semibold text-teal">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Account details: name, email, phone (optional), password (stored encrypted)</li>
            <li>Messages you send to the clinic team</li>
            <li>Photos you upload for clinical review</li>
            <li>Appointment requests and related notes</li>
          </ul>
          <h2 className="font-serif text-lg font-semibold text-teal">How we use it</h2>
          <p>
            To coordinate your care, respond to non-urgent queries, and manage appointments. This portal does not replace
            emergency services or the instructions on your discharge letter.
          </p>
          <h2 className="font-serif text-lg font-semibold text-teal">Your rights</h2>
          <p>
            Under UK GDPR you may request access, correction, or deletion of your portal data. Contact the practice at{" "}
            <a href="mailto:pa@willsarakbi.com" className="text-teal hover:underline">
              pa@willsarakbi.com
            </a>
            .
          </p>
          <h2 className="font-serif text-lg font-semibold text-teal">Retention</h2>
          <p>
            Data is kept only as long as needed for care and regulatory purposes. The clinic may remove portal accounts
            when no longer required.
          </p>
        </section>

        <p className="mt-10 text-sm">
          <Link href="/" className="text-teal hover:underline">
            ← Back
          </Link>
          {" · "}
          <a href={site} className="text-teal hover:underline">
            Main website
          </a>
        </p>
      </article>
    </div>
  );
}
