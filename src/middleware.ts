import { jwtVerify } from "jose/jwt/verify";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "sarakbi_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (pathname.startsWith("/portal") || pathname.startsWith("/team")) {
      return NextResponse.redirect(new URL("/login?error=config", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = payload.role as string;
    if (pathname.startsWith("/portal") && role !== "PATIENT") {
      if (role === "STAFF") {
        return NextResponse.redirect(new URL("/team", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/team") && role !== "STAFF") {
      if (role === "PATIENT") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/team/:path*"],
};
