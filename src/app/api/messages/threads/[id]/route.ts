import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { markThreadRead } from "@/lib/message-read";
import { notifyPatientNewMessage, notifyEmailLater } from "@/lib/portal-email";
import { notifyStaffLater, notifyStaffNewMessage } from "@/lib/staff-notify-email";
import { getSession } from "@/lib/session";

const postMessageSchema = z.object({
  body: z.string().min(1).max(8000),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const thread = await prisma.messageThread.findUnique({
    where: { id },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role === "PATIENT" && thread.patientId !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.role !== "STAFF" && session.role !== "PATIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await markThreadRead(id, session.sub, session.role);

  return NextResponse.json({ thread });
}

export async function POST(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const thread = await prisma.messageThread.findUnique({
    where: { id },
    include: { patient: { select: { name: true, email: true } } },
  });
  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role === "PATIENT" && thread.patientId !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.role !== "STAFF" && session.role !== "PATIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = postMessageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const body = parsed.data.body.trim();

  await prisma.message.create({
    data: {
      threadId: id,
      senderId: session.sub,
      body,
    },
  });

  await prisma.messageThread.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  if (session.role === "PATIENT") {
    notifyStaffLater(() =>
      notifyStaffNewMessage({
        patientName: session.name || thread.patient.name,
        patientEmail: session.email,
        subject: thread.subject,
        category: thread.category,
        body,
        threadId: id,
        isNewThread: false,
      }),
    );
  } else if (session.role === "STAFF") {
    notifyEmailLater(() =>
      notifyPatientNewMessage({
        patientEmail: thread.patient.email,
        patientName: thread.patient.name,
        subject: thread.subject,
        body,
        threadId: id,
      }),
    );
  }

  return NextResponse.json({ ok: true });
}
