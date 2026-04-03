import { z } from "zod";

export const messageThreadCategorySchema = z.enum([
  "APPOINTMENT",
  "WOUND_CARE",
  "MEDICATION",
  "RESULTS_OR_LETTERS",
  "ADMIN",
  "OTHER",
]);

export type MessageThreadCategory = z.infer<typeof messageThreadCategorySchema>;

export const MESSAGE_THREAD_CATEGORIES: { value: MessageThreadCategory; label: string; hint: string }[] = [
  {
    value: "APPOINTMENT",
    label: "Appointments & scheduling",
    hint: "Dates, locations, cancellations",
  },
  {
    value: "WOUND_CARE",
    label: "Wound, dressing or drain",
    hint: "Healing, dressings, seroma concerns (non-urgent)",
  },
  {
    value: "MEDICATION",
    label: "Medication",
    hint: "Doses, side effects, prescriptions",
  },
  {
    value: "RESULTS_OR_LETTERS",
    label: "Results or letters",
    hint: "Test results, clinic letters, paperwork",
  },
  { value: "ADMIN", label: "Admin", hint: "Billing, referrals, general admin" },
  { value: "OTHER", label: "Other", hint: "Anything that does not fit above" },
];

export function categoryLabel(value: string | null | undefined): string {
  if (!value) return "Uncategorised";
  const row = MESSAGE_THREAD_CATEGORIES.find((c) => c.value === value);
  return row?.label ?? value;
}
