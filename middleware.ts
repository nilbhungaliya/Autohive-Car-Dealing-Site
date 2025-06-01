// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { env } from "@/env";
// import { routes } from "./config/routes";
// import db from "@/lib/db";

// export async function middleware(req: NextRequest) {
//   const requestHeaders = new Headers(req.headers);
//   const nextUrl = req.nextUrl.clone();

//   // 1. Generate nonce and CSP
//   const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
//   const csp = `
//     default-src 'self';
//     script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
//     style-src 'self' 'nonce-${nonce}';
//     img-src 'self' blob: data:;
//     font-src 'self';
//     base-uri 'self';
//     object-src 'none';
//     form-action 'self';
//     frame-ancestors 'none';
//     upgrade-insecure-requests;
//   `
//     .replace(/\s{2,}/g, " ")
//     .trim();

//   requestHeaders.set("x-auth-token", `Bearer ${env.X_AUTH_TOKEN}`);
//   requestHeaders.set("x-nonce", nonce);
//   requestHeaders.set("Content-Security-Policy", csp);

//   // 2. Get session token from cookie
//   //   console.log(req.cookies.getAll());
//   const sessionToken = req.cookies.get("authjs.session-token")?.value;
// //   console.log(sessionToken);
  
//   let userSession = null;

//   if (sessionToken) {
//     userSession = await db.session.findUnique({
//       where: { sessionToken },
//       select: {
//         userId: true,
//         expires: true,
//         requires2FA: true,
//       },
//     });
//   }

//   // 3. Auth logic
//   if (userSession && userSession.expires > new Date()) {
//     if (userSession.requires2FA) {
//       if (nextUrl.pathname === routes.challenge) {
//         return NextResponse.next({ request: { headers: requestHeaders } });
//       }
//       return NextResponse.redirect(new URL(routes.challenge, req.url));
//     }

//     if (
//       nextUrl.pathname === routes.challenge ||
//       nextUrl.pathname === routes.signIn
//     ) {
//       return NextResponse.redirect(new URL(routes.admin.dashboard, req.url));
//     }
//   } else {
//     if (
//       nextUrl.pathname.startsWith("/admin") ||
//       nextUrl.pathname === routes.challenge
//     ) {
//       return NextResponse.redirect(new URL(routes.signIn, req.url));
//     }
//   }

//   // 4. Continue request
//   return NextResponse.next({
//     request: { headers: requestHeaders },
//   });
// }

// // Match everything except public/static routes
// export const config = {
//   matcher:
//     "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
// };


import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { env } from "@/env";
import { NextResponse } from "next/server";

function setRequestHeaders(requestHeaders: Headers) {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
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
  `;

	requestHeaders.set("x-auth-token", `Bearer ${env.X_AUTH_TOKEN}`);

	const contentSecurityPolicy = cspHeader.replace(/\s{2,}/g, " ").trim();
	requestHeaders.set("x-nonce", nonce);
	requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
}

export default auth((req) => {
	const nextUrl = req.nextUrl.clone();
	const requestHeaders = new Headers(req.headers);
	setRequestHeaders(requestHeaders);

	if (req.auth) {
		if (req.auth.requires2FA) {
			if (nextUrl.pathname === routes.challenge) {
				return NextResponse.next();
			}

			const challengeUrl = new URL(routes.challenge, req.url);
			return NextResponse.redirect(challengeUrl);
		}

		if (
			nextUrl.pathname === routes.challenge ||
			nextUrl.pathname === routes.signIn
		) {
			const adminUrl = new URL(routes.admin.dashboard, req.url);
			return NextResponse.redirect(adminUrl);
		}
	} else {
		if (
			nextUrl.pathname.startsWith("/admin") ||
			nextUrl.pathname === routes.challenge
		) {
			const signInUrl = new URL(routes.signIn, req.url);
			return NextResponse.redirect(signInUrl);
		}
	}

	return NextResponse.next({
		// !-- IMPORTANT: do not do this, it will break server actions
		// !-- headers: requestHeaders - this interferes with server action requests
		// instead, do this
		request: {
			headers: requestHeaders,
		},
	});
});

export const config = {
	matcher:
		"/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
	runtime: "nodejs",
};