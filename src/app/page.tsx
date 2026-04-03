import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";
import { isPublicRegistrationEnabled } from "@/lib/features";
import { patientAppIncludes } from "@/lib/patient-app-includes";
import { getPublicSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const SITE = getPublicSiteUrl();
  const allowReg = isPublicRegistrationEnabled();
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-blue via-cream to-cream-dark">
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Image
              src="/practice-logo.png"
              alt="Mr Will Sarakbi — Surgeon"
              width={200}
              height={80}
              className="h-12 w-auto shrink-0 object-contain sm:h-14"
              priority
            />
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold tracking-tight text-teal sm:text-xl">
                Patient portal
              </p>
              <p className="text-xs text-ink-muted">Recovery · reminders · FAQs · messaging</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-teal hover:bg-teal/5"
            >
              Sign in
            </Link>
            {allowReg ? (
              <Link
                href="/register"
                className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-light"
              >
                Create account
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Exceptional breast care.
          <span className="text-gold"> Outstanding support.</span>
        </p>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted">
          Your private space for recovery support, follow-ups, and the practice team — aligned with the same standards of care as our
          main website.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          {allowReg ? (
            <Link
              href="/register"
              className="inline-flex rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-light"
            >
              Get started
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-light"
            >
              Sign in
            </Link>
          )}
          <a
            href={SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-cream-dark"
          >
            Visit main website
          </a>
        </div>

        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-teal">What the app includes</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Everything in one place to support your recovery and stay in touch with the team (non-urgent only — emergencies are not
            handled here).
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {patientAppIncludes.map((item) => (
              <Card key={item.title} className="!p-5">
                <h3 className="font-serif text-lg font-semibold text-teal">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-ink-muted">
          GMC 6027127 ·{" "}
          <a href={SITE} className="text-teal underline-offset-2 hover:underline">
            Mr Will Sarakbi
          </a>{" "}
          · This portal is a demonstration; configure hosting, database, and clinical governance before live use.
        </p>
      </main>
    </div>
  );
}
