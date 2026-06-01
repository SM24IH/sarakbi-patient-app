import { NextResponse } from "next/server";
import { totalUnreadForViewer } from "@/lib/message-read";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [unreadMessages, pendingAppointments, recentPhotos] = await Promise.all([
    totalUnreadForViewer(session.sub, session.role),
    prisma.appointment.count({ where: { status: "REQUESTED" } }),
    prisma.patientImage.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return NextResponse.json({ unreadMessages, pendingAppointments, recentPhotos });
}
