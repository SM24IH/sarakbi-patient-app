import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const patientLinks = [
  { href: "/portal", label: "Home" },
  { href: "/portal/appointments", label: "Appointments" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/recovery-guides", label: "Recovery guides" },
  { href: "/portal/care", label: "Care & info" },
  { href: "/portal/contact", label: "Contact" },
];

const teamLinks = [
  { href: "/team", label: "Overview" },
  { href: "/team/appointments", label: "Appointments" },
  { href: "/team/messages", label: "Inbox" },
  { href: "/team/documents", label: "Documents" },
  { href: "/team/patients", label: "Patients" },
];

export function PortalNav({
  variant,
  userName,
}: {
  variant: "patient" | "team";
  userName: string;
}) {
  const links = variant === "patient" ? patientLinks : teamLinks;
  const title = variant === "patient" ? "Patient portal" : "Clinic console";
  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-white/90 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="p-4 lg:p-6">
        <div className="mb-3">
          <Image
            src="/practice-logo.png"
            alt="Mr Will Sarakbi — Surgeon"
            width={180}
            height={72}
            className="h-11 w-auto object-contain lg:h-12"
          />
        </div>
        <p className="text-xs text-ink-muted">{title}</p>
        <p className="mt-3 truncate text-sm font-medium text-ink">{userName}</p>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
      <nav className="flex flex-wrap gap-1 px-2 pb-4 lg:flex-col lg:px-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-cream-dark hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
