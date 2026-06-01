import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-blue to-cream px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center font-serif text-2xl font-semibold text-teal">Reset password</p>
        <p className="mt-1 text-center text-sm text-ink-muted">We will email you a link if an account exists.</p>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-teal hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
