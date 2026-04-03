import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";
import { isPublicRegistrationEnabled } from "@/lib/features";
import { RegisterForm } from "./register-form";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const open = isPublicRegistrationEnabled();

  if (!open) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-blue to-cream px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <Image
              src="/practice-logo.png"
              alt="Mr Will Sarakbi — Surgeon"
              width={220}
              height={88}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-center font-serif text-2xl font-semibold text-teal">Patient portal</p>
          <Card className="mt-6">
            <p className="text-sm text-ink-muted">
              Online registration is not enabled. Please contact the practice to receive access to the patient portal.
            </p>
            <Link
              href="/portal/contact"
              className="mt-4 inline-block text-sm font-medium text-teal hover:underline"
            >
              Contact the practice →
            </Link>
          </Card>
          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="text-teal hover:underline">
              Sign in
            </Link>
            {" · "}
            <Link href="/" className="text-teal hover:underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-blue to-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image
            src="/practice-logo.png"
            alt="Mr Will Sarakbi — Surgeon"
            width={220}
            height={88}
            className="h-16 w-auto object-contain sm:h-[4.5rem]"
            priority
          />
        </div>
        <p className="text-center font-serif text-2xl font-semibold text-teal">Create patient account</p>
        <p className="mt-1 text-center text-sm text-ink-muted">
          Registration is for patients only. Clinic staff accounts are issued by the practice.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-teal hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-teal hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
