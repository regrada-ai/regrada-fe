/**
 * Client-side authentication utilities
 * These functions check auth state without making backend calls
 */

/**
 * Decode a JWT token without verification
 * This is for client-side checks only - server-side must verify signatures
 */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;

  return payload.exp * 1000 < Date.now();
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Check if the user is authenticated by checking cookies and token validity
 * This does NOT make any backend calls - it only checks client-side state
 *
 * @returns true if user appears to be authenticated (has valid tokens)
 */
export function isAuthenticatedClient(): boolean {
  const accessToken = getCookie("access_token");
  const refreshToken = getCookie("refresh_token");

  // Check if access token is valid
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  // Check if refresh token is valid
  if (refreshToken && !isTokenExpired(refreshToken)) {
    return true;
  }

  return false;
}
