import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
  const styles = {
    primary:
      "bg-teal text-white hover:bg-teal-light focus-visible:outline-teal shadow-sm",
    secondary:
      "bg-cream-dark text-ink border border-stone-200 hover:bg-stone-200/80 focus-visible:outline-stone-400",
    ghost: "text-teal hover:bg-teal/5 focus-visible:outline-teal",
  };
  return <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-stone-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal ${className}`}
      {...props}
    />
  );
}

export function TextArea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-stone-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-200/40 ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </label>
  );
}
