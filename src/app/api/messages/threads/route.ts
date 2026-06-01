import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { unreadCountForThread } from "@/lib/message-read";
import { messageThreadCategorySchema } from "@/lib/message-categories";
import { notifyPatientNewMessage, notifyEmailLater } from "@/lib/portal-email";
import { notifyStaffLater, notifyStaffNewMessage } from "@/lib/staff-notify-email";
import { getSession } from "@/lib/session";

const patientCreateSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(8000),
  category: messageThreadCategorySchema,
});

const staffCreateSchema = z.object({
  patientId: z.string().min(1),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(8000),
  category: messageThreadCategorySchema,
});

const threadInclude = {
  messages: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    include: { sender: { select: { id: true, name: true, role: true } } },
  },
};

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const patientIdFilter = searchParams.get("patientId")?.trim();

  if (session.role === "PATIENT") {
    const threads = await prisma.messageThread.findMany({
      where: { patientId: session.sub },
      orderBy: { updatedAt: "desc" },
      include: threadInclude,
    });
    const withUnread = await Promise.all(
      threads.map(async (t) => ({
        ...t,
        unreadCount: await unreadCountForThread(t.id, session.sub, session.role),
      })),
    );
    return NextResponse.json({ threads: withUnread });
  }

  if (session.role === "STAFF") {
    const threads = await prisma.messageThread.findMany({
      where: patientIdFilter ? { patientId: patientIdFilter } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        ...threadInclude,
      },
    });
    const withUnread = await Promise.all(
      threads.map(async (t) => ({
        ...t,
        unreadCount: await unreadCountForThread(t.id, session.sub, session.role),
      })),
    );
    return NextResponse.json({ threads: withUnread });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (session.role === "PATIENT") {
    const parsed = patientCreateSchema.safeParse(json);
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

  if (session.role === "STAFF") {
    const parsed = staffCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const patient = await prisma.user.findUnique({ where: { id: parsed.data.patientId } });
    if (!patient || patient.role !== "PATIENT") {
      return NextResponse.json({ error: "Invalid patient" }, { status: 400 });
    }

    const thread = await prisma.messageThread.create({
      data: {
        patientId: patient.id,
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

    notifyEmailLater(() =>
      notifyPatientNewMessage({
        patientEmail: patient.email,
        patientName: patient.name,
        subject: thread.subject,
        body: parsed.data.body.trim(),
        threadId: thread.id,
      }),
    );

    return NextResponse.json({ threadId: thread.id });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
