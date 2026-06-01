import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

/** Mark inbound messages in a thread as read for the viewer. */
export async function markThreadRead(threadId: string, viewerId: string, viewerRole: Role) {
  await prisma.message.updateMany({
    where: {
      threadId,
      readAt: null,
      sender: { role: viewerRole === "STAFF" ? "PATIENT" : "STAFF" },
    },
    data: { readAt: new Date() },
  });
}

export async function unreadCountForThread(threadId: string, viewerId: string, viewerRole: Role) {
  return prisma.message.count({
    where: {
      threadId,
      readAt: null,
      sender: { role: viewerRole === "STAFF" ? "PATIENT" : "STAFF" },
    },
  });
}

export async function totalUnreadForViewer(viewerId: string, viewerRole: Role) {
  const patientFilter =
    viewerRole === "PATIENT" ? { patientId: viewerId } : undefined;

  const threads = await prisma.messageThread.findMany({
    where: patientFilter,
    select: { id: true },
  });

  if (threads.length === 0) return 0;

  return prisma.message.count({
    where: {
      threadId: { in: threads.map((t) => t.id) },
      readAt: null,
      sender: { role: viewerRole === "STAFF" ? "PATIENT" : "STAFF" },
    },
  });
}
