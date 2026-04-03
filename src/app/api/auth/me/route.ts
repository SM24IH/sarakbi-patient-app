import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** Current user from Bearer token (native apps) or session cookie (web). */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    email: session.email,
    name: session.name,
    role: session.role,
  });
}
