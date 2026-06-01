/**
 * Canonical origin for this portal/API deployment (HTTPS, iOS API_BASE_URL).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://portal.willsarakbi.com).
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
  return "https://sarakbi-patient-app.vercel.app";
}
