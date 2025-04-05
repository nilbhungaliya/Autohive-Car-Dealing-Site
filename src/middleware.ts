// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { routes } from "./config/routes";
import db from "@/lib/db";

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  const nextUrl = req.nextUrl.clone();

  // 1. Generate nonce and CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    base-uri 'self';
    object-src 'none';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  requestHeaders.set("x-auth-token", `Bearer ${env.X_AUTH_TOKEN}`);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // 2. Get session token from cookie
  //   console.log(req.cookies.getAll());
  const sessionToken = req.cookies.get("authjs.session-token")?.value;
//   console.log(sessionToken);
  
  let userSession = null;

  if (sessionToken) {
    userSession = await db.session.findUnique({
      where: { sessionToken },
      select: {
        userId: true,
        expires: true,
        requires2FA: true,
      },
    });
  }

  // 3. Auth logic
  if (userSession && userSession.expires > new Date()) {
    if (userSession.requires2FA) {
      if (nextUrl.pathname === routes.challenge) {
        return NextResponse.next({ request: { headers: requestHeaders } });
      }
      return NextResponse.redirect(new URL(routes.challenge, req.url));
    }

    if (
      nextUrl.pathname === routes.challenge ||
      nextUrl.pathname === routes.signIn
    ) {
      return NextResponse.redirect(new URL(routes.admin.dashboard, req.url));
    }
  } else {
    if (
      nextUrl.pathname.startsWith("/admin") ||
      nextUrl.pathname === routes.challenge
    ) {
      return NextResponse.redirect(new URL(routes.signIn, req.url));
    }
  }

  // 4. Continue request
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Match everything except public/static routes
export const config = {
  matcher:
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
};
