/**
 * Canonical public origin for this deployment (HTTPS links, native app API base).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-app.netlify.app).
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !explicit.includes("$(")) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel && !vercel.includes("$(")) {
    const host = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return host.replace(/\/$/, "");
  }
  return "https://regal-salmiakki-509632.netlify.app";
}
