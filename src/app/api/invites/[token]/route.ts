import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  const invite = await prisma.patientInvite.findUnique({ where: { token } });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    email: invite.email,
    name: invite.name,
  });
}
