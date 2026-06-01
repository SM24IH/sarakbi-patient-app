import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlotISOStrings } from "@/lib/appointment-slots";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const querySchema = z.object({
  location: z.enum(["Cadogan Clinic, Chelsea", "Shirley Oaks Hospital, Surrey"]),
});

/** GET /api/appointment-slots?location=... — isolated from /api/appointments so responses never get mixed up. */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({ location: searchParams.get("location") ?? undefined });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }
    const slots = await getAvailableSlotISOStrings(prisma, parsed.data.location);
    return NextResponse.json({ slots });
  } catch (e) {
    console.error("[appointment-slots]", e);
    return NextResponse.json({ error: "Could not load appointment slots" }, { status: 500 });
  }
}
