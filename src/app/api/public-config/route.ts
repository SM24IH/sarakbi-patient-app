import { NextResponse } from "next/server";
import { isPublicRegistrationEnabled } from "@/lib/features";
import { getPublicContact } from "@/lib/public-contact";
import { getPublicSiteUrl } from "@/lib/site-url";

/** Unauthenticated metadata for native apps and clients. */
export async function GET() {
  const contact = getPublicContact();
  return NextResponse.json({
    allowRegistration: isPublicRegistrationEnabled(),
    practiceName: "Mr Will Sarakbi",
    tagline: "Consultant Oncoplastic Breast Surgeon",
    websiteUrl: getPublicSiteUrl(),
    urgentCarePhone: contact.urgentCarePhone,
    urgentCareLabel: contact.urgentCareLabel,
    afterHoursPhone: contact.afterHoursPhone,
    afterHoursLabel: contact.afterHoursLabel,
    supportEmail: contact.supportEmail,
    redFlagBullets: contact.redFlagBullets,
  });
}
