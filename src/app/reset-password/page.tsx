import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-blue to-cream px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center font-serif text-2xl font-semibold text-teal">Choose a new password</p>
        <ResetPasswordForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-teal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
