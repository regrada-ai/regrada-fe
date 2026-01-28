import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/api-keys", "/invite"];

// Routes that are always accessible (public)
const publicRoutes = ["/", "/docs", "/terms", "/privacy", "/accept-invite"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public (always accessible)
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const authToken =
    request.cookies.get("access_token") || request.cookies.get("refresh_token");
  const hasSession = !!authToken;

  // Allow public routes without any checks
  if (isPublicRoute && !hasSession) {
    return NextResponse.next();
  }

  // Get the authentication token (lightweight check only - no validation)

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the route is an auth page (login/signup)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If accessing an auth route with a session, check if tokens are expired
  if (isAuthRoute && hasSession) {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    let isValid = false;

    // Check if access token is valid
    if (accessToken) {
      try {
        const decoded = decodeJwt(accessToken);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          isValid = true;
        }
      } catch {
        // Token is invalid
      }
    }

    // Check if refresh token is valid
    if (!isValid && refreshToken) {
      try {
        const decoded = decodeJwt(refreshToken);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          isValid = true;
        }
      } catch {
        // Token is invalid
      }
    }

    // If tokens are expired, clear them and allow login
    if (!isValid) {
      const res = NextResponse.next();
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }

    // Session is valid, redirect to dashboard
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes use this proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif).*)",
  ],
};
