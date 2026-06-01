import { addDays, getISODay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import type { PrismaClient } from "@prisma/client";

const TZ = "Europe/London";

/** Calendar date (YYYY-MM-DD) in Europe/London for an instant. */
export function londonYmd(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const mo = parts.find((p) => p.type === "month")!.value;
  const da = parts.find((p) => p.type === "day")!.value;
  return `${y}-${mo}-${da}`;
}

export function slotConfig() {
  return {
    slotMinutes: Math.min(120, Math.max(15, Number(process.env.APPOINTMENT_SLOT_MINUTES ?? 30))),
    bufferHours: Math.max(0, Number(process.env.APPOINTMENT_BOOKING_BUFFER_HOURS ?? 2)),
    daysAhead: Math.min(90, Math.max(7, Number(process.env.APPOINTMENT_BOOKING_DAYS_AHEAD ?? 56))),
    dayStartHour: Math.max(6, Math.min(12, Number(process.env.APPOINTMENT_DAY_START_HOUR ?? 9))),
    /** Hour after which no new slot may *start* (e.g. 17 = last 30‑min slot starts 16:30). */
    dayEndHourExclusive: Math.max(13, Math.min(21, Number(process.env.APPOINTMENT_DAY_END_HOUR ?? 17))),
  };
}

function minuteKey(d: Date): number {
  return Math.floor(d.getTime() / 60_000);
}

/** All candidate slot starts (UTC) for the configured horizon, before removing booked times. */
export function generateCandidateSlots(now: Date = new Date()): Date[] {
  const { slotMinutes, bufferHours, daysAhead, dayStartHour, dayEndHourExclusive } = slotConfig();
  const minStart = new Date(now.getTime() + bufferHours * 60 * 60 * 1000);

  const firstMinuteOfDay = dayStartHour * 60;
  const lastStartMinute = dayEndHourExclusive * 60 - slotMinutes;

  const out: Date[] = [];
  const anchor = fromZonedTime(`${londonYmd(now)}T12:00:00`, TZ);

  for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
    const noonThatDay = addDays(anchor, dayOffset);
    const dateStr = londonYmd(noonThatDay);
    const middayUtc = fromZonedTime(`${dateStr}T12:00:00`, TZ);
    const dow = getISODay(middayUtc);
    if (dow === 6 || dow === 7) continue;

    for (let mins = firstMinuteOfDay; mins <= lastStartMinute; mins += slotMinutes) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const localStr = `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
      const utc = fromZonedTime(localStr, TZ);
      if (utc.getTime() >= minStart.getTime()) {
        out.push(utc);
      }
    }
  }

  return out.sort((a, b) => a.getTime() - b.getTime());
}

export async function getAvailableSlotISOStrings(
  prisma: PrismaClient,
  location: string,
  now: Date = new Date(),
): Promise<string[]> {
  const candidates = generateCandidateSlots(now);
  if (candidates.length === 0) return [];

  const from = candidates[0]!;
  const to = candidates[candidates.length - 1]!;

  const taken = await prisma.appointment.findMany({
    where: {
      location,
      status: { in: ["REQUESTED", "CONFIRMED"] },
      requestedAt: { gte: from, lte: to },
    },
    select: { requestedAt: true },
  });

  const takenKeys = new Set(taken.map((t) => minuteKey(t.requestedAt)));

  return candidates
    .filter((c) => !takenKeys.has(minuteKey(c)))
    .map((c) => c.toISOString());
}

/** True if this instant matches an allowed slot start and is not already taken. */
export async function isRequestedSlotValid(
  prisma: PrismaClient,
  location: string,
  requestedAt: Date,
  now: Date = new Date(),
): Promise<boolean> {
  const available = await getAvailableSlotISOStrings(prisma, location, now);
  const want = minuteKey(requestedAt);
  return available.some((iso) => minuteKey(new Date(iso)) === want);
}
