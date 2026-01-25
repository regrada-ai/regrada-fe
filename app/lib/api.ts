const API_BASE =
  process.env.NEXT_PUBLIC_REGRADA_API_BASE_URL || "http://localhost:8080";

/**
 * Fetch wrapper that automatically includes credentials (cookies)
 */
export type ApiError = Error & { status?: number; payload?: unknown };

export async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies in requests
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload as { error?: { message?: string } })?.error?.message ||
      response.statusText ||
      `Request failed (${response.status})`;
    const error = new Error(message) as ApiError;
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload as T;
}

/**
 * Auth API helpers
 */
export const authAPI = {
  signUp: async (email: string, password: string, name: string) => {
    return authenticatedFetch(`${API_BASE}/v1/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  confirmSignUp: async (email: string, code: string) => {
    return authenticatedFetch(`${API_BASE}/v1/auth/confirm`, {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  signIn: async (email: string, password: string) => {
    return authenticatedFetch(`${API_BASE}/v1/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signOut: async () => {
    return authenticatedFetch(`${API_BASE}/v1/auth/signout`, {
      method: "POST",
    });
  },

  me: async () => {
    return authenticatedFetch<{ user: never }>(`${API_BASE}/v1/auth/me`);
  },

  refresh: async () => {
    return authenticatedFetch(`${API_BASE}/v1/auth/refresh`, {
      method: "POST",
    });
  },
};
