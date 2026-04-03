import { Card } from "@/components/ui";
import { getPublicContact } from "@/lib/public-contact";

function TelLink({ phone, label }: { phone: string; label: string }) {
  const compact = phone.replace(/\s+/g, "");
  return (
    <p className="text-sm">
      <span className="text-ink-muted">{label}: </span>
      <a href={`tel:${compact}`} className="font-semibold text-teal hover:underline">
        {phone}
      </a>
    </p>
  );
}

/** Red flags + optional practice phone lines from env (`getPublicContact`). */
export function UrgentCareCard({ variant = "full" }: { variant?: "full" | "compact" }) {
  const c = getPublicContact();

  return (
    <Card
      className={
        variant === "compact"
          ? "!p-4 border-amber-200/90 bg-amber-50/40"
          : "!p-6 border-amber-200/90 bg-amber-50/50"
      }
    >
      <h2 className="font-serif text-lg font-semibold text-ink">
        {variant === "compact" ? "Not for emergencies" : "Urgent symptoms — use your discharge instructions"}
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        This app and messaging are <strong className="text-ink">not</strong> for emergencies. If you could be seriously unwell, call{" "}
        <strong className="text-ink">999</strong> or go to an emergency department. Otherwise use the urgent numbers in your discharge
        pack, or:
      </p>
      {c.urgentCarePhone ? (
        <div className="mt-3">
          <TelLink phone={c.urgentCarePhone} label={c.urgentCareLabel} />
        </div>
      ) : (
        <p className="mt-3 text-sm italic text-ink-muted">
          Configure <code className="rounded bg-white/80 px-1 text-xs">PUBLIC_URGENT_PHONE</code> on the server to show the practice
          daytime urgent line here.
        </p>
      )}
      {c.afterHoursPhone ? (
        <div className="mt-2">
          <TelLink phone={c.afterHoursPhone} label={c.afterHoursLabel} />
        </div>
      ) : null}
      {c.supportEmail ? (
        <p className="mt-2 text-sm">
          <span className="text-ink-muted">Email (non-urgent): </span>
          <a href={`mailto:${c.supportEmail}`} className="font-medium text-teal hover:underline">
            {c.supportEmail}
          </a>
        </p>
      ) : null}

      {variant === "full" ? (
        <>
          <h3 className="mt-6 font-serif text-base font-semibold text-ink">Seek urgent advice if you have</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
            {c.redFlagBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}
    </Card>
  );
}
