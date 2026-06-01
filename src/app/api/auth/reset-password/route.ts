import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const bodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
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
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  await prisma.passwordResetToken.delete({ where: { id: record.id } });

  return NextResponse.json({ ok: true });
}
