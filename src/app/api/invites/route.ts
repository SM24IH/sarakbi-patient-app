import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendPatientInviteEmail, notifyEmailLater } from "@/lib/portal-email";
import { getSession } from "@/lib/session";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invites = await prisma.patientInvite.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      email: true,
      name: true,
      usedAt: true,
      expiresAt: true,
      createdAt: true,
      createdBy: { select: { name: true } },
    },
  });

  return NextResponse.json({ invites });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") {
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

  const email = parsed.data.email.toLowerCase().trim();
  const name = parsed.data.name?.trim() || null;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const invite = await prisma.patientInvite.create({
    data: {
      email,
      name,
      token,
      expiresAt,
      createdById: session.sub,
    },
  });

  notifyEmailLater(() =>
    sendPatientInviteEmail({ email, name, inviteToken: invite.token }),
  );

  return NextResponse.json({ invite: { id: invite.id, email: invite.email, expiresAt: invite.expiresAt } });
}
