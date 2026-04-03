/** When false, self-service registration is disabled (web + API + app reads /api/public-config). */
export function isPublicRegistrationEnabled(): boolean {
  return process.env.PUBLIC_REGISTRATION !== "false";
}
