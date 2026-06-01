import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail, notifyEmailLater } from "@/lib/portal-email";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return ok to avoid email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  notifyEmailLater(() =>
    sendPasswordResetEmail({ email: user.email, name: user.name, resetToken: token }),
  );

  return NextResponse.json({ ok: true });
}
