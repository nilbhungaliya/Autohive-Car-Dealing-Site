import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type RequestWithAuth = NextRequest & {
	auth?: {
		requires2FA?: boolean;
	} | null;
};

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

async function getSessionState(req: RequestWithAuth) {
	if (req.auth) {
		return {
			authenticated: true,
			requires2FA: Boolean(req.auth.requires2FA),
		};
	}

	const sessionToken = req.cookies.get("authjs.session-token")?.value;

	if (!sessionToken) {
		return { authenticated: false, requires2FA: false };
	}

	const session = await db.session.findUnique({
		where: { sessionToken },
		select: {
			expires: true,
			requires2FA: true,
		},
	});

	if (!session || session.expires <= new Date()) {
		return { authenticated: false, requires2FA: false };
	}

	return {
		authenticated: true,
		requires2FA: session.requires2FA,
	};
}

export default auth(async (req) => {
	const nextUrl = req.nextUrl.clone();
	const requestHeaders = new Headers(req.headers);
	setRequestHeaders(requestHeaders);
	const pathname = nextUrl.pathname;
	const isAdminRoute = pathname.startsWith("/admin");
	const isChallengeRoute = pathname === routes.challenge;
	const isSignInRoute = pathname === routes.signIn;
	const session = await getSessionState(req);
	const isAuthenticated = session.authenticated;
	const requires2FA = session.requires2FA;
	const proceed = () =>
		NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});

	if (!isAuthenticated) {
		if (isAdminRoute || isChallengeRoute) {
			const signInUrl = new URL(routes.signIn, req.url);
			return NextResponse.redirect(signInUrl);
		}

		return proceed();
	}

	if (requires2FA) {
		if (isChallengeRoute) {
			return proceed();
		}

		const challengeUrl = new URL(routes.challenge, req.url);
		return NextResponse.redirect(challengeUrl);
	}

	if (isChallengeRoute || isSignInRoute) {
		const adminUrl = new URL(routes.admin.dashboard, req.url);
		return NextResponse.redirect(adminUrl);
	}

	return proceed();
});

export const config = {
	matcher:
		"/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
	runtime: "nodejs",
};

