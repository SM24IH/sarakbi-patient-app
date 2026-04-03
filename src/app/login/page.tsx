import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { isPublicRegistrationEnabled } from "@/lib/features";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const allowReg = isPublicRegistrationEnabled();

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
        <p className="text-center font-serif text-2xl font-semibold text-teal">Sign in</p>
        <p className="mt-1 text-center text-sm text-ink-muted">Patient portal or clinic team</p>
        <Suspense fallback={<p className="mt-8 text-center text-sm text-ink-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
        {allowReg ? (
          <p className="mt-6 text-center text-sm text-ink-muted">
            No account?{" "}
            <Link href="/register" className="font-medium text-teal hover:underline">
              Register as a patient
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-ink-muted">
            Need access? Contact the practice for a portal account.
          </p>
        )}
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-teal hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
