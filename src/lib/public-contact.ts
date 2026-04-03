/**
 * Contact & safety copy for patients — surfaced in public-config API and server-rendered portal pages.
 * Override with env in production; null phones are hidden in the UI.
 */
export type PublicContact = {
  urgentCarePhone: string | null;
  urgentCareLabel: string;
  afterHoursPhone: string | null;
  afterHoursLabel: string;
  supportEmail: string | null;
  /** Short bullets — seek urgent care if these occur (not exhaustive). */
  redFlagBullets: string[];
};

export function getPublicContact(): PublicContact {
  return {
    urgentCarePhone: process.env.PUBLIC_URGENT_PHONE?.trim() || null,
    urgentCareLabel: process.env.PUBLIC_URGENT_LABEL?.trim() || "Urgent clinical line (daytime)",
    afterHoursPhone: process.env.PUBLIC_AFTER_HOURS_PHONE?.trim() || null,
    afterHoursLabel: process.env.PUBLIC_AFTER_HOURS_LABEL?.trim() || "After-hours / ward",
    supportEmail: process.env.PUBLIC_SUPPORT_EMAIL?.trim() || null,
    redFlagBullets: [
      "A fever of 38°C or higher, shaking chills, or you feel much worse suddenly.",
      "Rapidly spreading redness, pus, or an opening wound along your scar — or a drain that stops working when one is in place.",
      "Severe or worsening pain not controlled by the pain relief agreed with your team.",
      "Sudden swelling, tightness, or colour change of the breast or reconstruction, with severe pain.",
      "Chest pain, breathlessness, fainting, or coughed-up blood.",
      "Any symptom your discharge letter lists as urgent — treat that letter as the authority.",
    ],
  };
}
