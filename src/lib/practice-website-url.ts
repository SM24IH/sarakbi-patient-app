/**
 * Public marketing website (www.willsarakbi.com) — not the patient portal API host.
 */
export function getPracticeWebsiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_PRACTICE_WEBSITE_URL?.trim();
  if (explicit && !explicit.includes("$(")) {
    return explicit.replace(/\/$/, "");
  }
  return "https://www.willsarakbi.com";
}
