import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyStaffLater, notifyStaffNewMessage } from "@/lib/staff-notify-email";
import { getSession } from "@/lib/session";
import { messageThreadCategorySchema } from "@/lib/message-categories";

const createSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(8000),
  category: messageThreadCategorySchema,
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "PATIENT") {
    const threads = await prisma.messageThread.findMany({
      where: { patientId: session.sub },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });
    return NextResponse.json({ threads });
  }

  if (session.role === "STAFF") {
    const threads = await prisma.messageThread.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });
    return NextResponse.json({ threads });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const thread = await prisma.messageThread.create({
    data: {
      patientId: session.sub,
      subject: parsed.data.subject.trim(),
      category: parsed.data.category,
      messages: {
        create: {
          senderId: session.sub,
          body: parsed.data.body.trim(),
        },
      },
    },
  });

  notifyStaffLater(() =>
    notifyStaffNewMessage({
      patientName: session.name || "Patient",
      patientEmail: session.email,
      subject: thread.subject,
      category: thread.category,
      body: parsed.data.body.trim(),
      threadId: thread.id,
      isNewThread: true,
    }),
  );

  return NextResponse.json({ threadId: thread.id });
}
