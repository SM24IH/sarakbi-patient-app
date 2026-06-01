import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isPublicRegistrationEnabled } from "@/lib/features";
import { hashPassword } from "@/lib/password";
import { createSessionToken, setSessionCookie } from "@/lib/session";

const bodySchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Enter your name").max(120),
  phone: z.string().max(40).optional(),
  inviteToken: z.string().optional(),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy notice" }),
  }),
});

function firstZodIssue(err: z.ZodError): string {
  const f = err.flatten();
  const fieldMsgs = Object.values(f.fieldErrors).flat().filter(Boolean) as string[];
  if (fieldMsgs.length > 0) return fieldMsgs[0]!;
  if (f.formErrors.length > 0) return f.formErrors[0]!;
  return "Invalid input";
}

export async function POST(request: Request) {
  const publicOpen = isPublicRegistrationEnabled();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodIssue(parsed.error) }, { status: 400 });
  }

  const inviteToken = parsed.data.inviteToken?.trim();
  if (!publicOpen && !inviteToken) {
    return NextResponse.json(
      {
        error:
          "Online registration is not available. Please use the invitation link from the practice.",
      },
      { status: 403 },
    );
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { error: "Registration is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const email = parsed.data.email.toLowerCase();

  let inviteId: string | null = null;
  if (inviteToken) {
    const invite = await prisma.patientInvite.findUnique({ where: { token: inviteToken } });
    if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation link is invalid or expired." }, { status: 400 });
    }
    if (invite.email.toLowerCase() !== email) {
      return NextResponse.json({ error: "Email must match your invitation." }, { status: 400 });
    }
    inviteId = invite.id;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(parsed.data.password),
        name: parsed.data.name.trim(),
        phone: parsed.data.phone?.trim() || null,
        role: Role.PATIENT,
      },
    });

    if (inviteId) {
      await prisma.patientInvite.update({
        where: { id: inviteId },
        data: { usedAt: new Date() },
      });
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      name: user.name,
      role: user.role,
      token,
      redirect: "/portal",
    });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
