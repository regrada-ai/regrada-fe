const API_BASE =
  process.env.NEXT_PUBLIC_REGRADA_API_BASE_URL || "http://localhost:8080";

/**
 * User type from authentication
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Organization type
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: "standard" | "pro" | "enterprise";
  github_org_id?: number;
  github_org_name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Signup request type
 */
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  create_organization?: boolean;
  organization_name?: string;
  invite_token?: string;
}

/**
 * Signup response type
 */
export interface SignUpResponse {
  success: boolean;
  message: string;
  organization_id?: string;
  user_confirmed: boolean;
}

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
  signUp: async (request: SignUpRequest) => {
    return authenticatedFetch<SignUpResponse>(`${API_BASE}/v1/auth/signup`, {
      method: "POST",
      body: JSON.stringify(request),
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
    return authenticatedFetch<{ user: User }>(`${API_BASE}/v1/auth/me`);
  },

  refresh: async () => {
    return authenticatedFetch(`${API_BASE}/v1/auth/refresh`, {
      method: "POST",
    });
  },
};

/**
 * Organization API helpers
 */
export const organizationAPI = {
  create: async (name: string, slug: string, tier: string = "standard") => {
    return authenticatedFetch<Organization>(`${API_BASE}/v1/organizations`, {
      method: "POST",
      body: JSON.stringify({ name, slug, tier }),
    });
  },

  list: async () => {
    return authenticatedFetch<{ organizations: Organization[] }>(
      `${API_BASE}/v1/organizations`,
    );
  },

  get: async (organizationId: string) => {
    return authenticatedFetch<Organization>(
      `${API_BASE}/v1/organizations/${organizationId}`,
    );
  },

  update: async (
    organizationId: string,
    updates: Partial<Pick<Organization, "name" | "tier">>,
  ) => {
    return authenticatedFetch<Organization>(
      `${API_BASE}/v1/organizations/${organizationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
  },

  createInvite: async (
    organizationId: string,
    email: string,
    role: string = "user",
  ) => {
    return authenticatedFetch<{ invite_token: string; expires_at: string }>(
      `${API_BASE}/v1/organizations/${organizationId}/invites`,
      {
        method: "POST",
        body: JSON.stringify({ email, role }),
      },
    );
  },

  listInvites: async (organizationId: string) => {
    return authenticatedFetch<{
      invites: Array<{
        id: string;
        email: string;
        role: string;
        status: string;
        created_at: string;
        expires_at: string;
      }>;
    }>(`${API_BASE}/v1/organizations/${organizationId}/invites`);
  },

  getInvite: async (inviteToken: string) => {
    return authenticatedFetch<{
      organization_name: string;
      inviter_name: string;
      email: string;
    }>(`${API_BASE}/v1/invites/${inviteToken}`);
  },

  acceptInvite: async (inviteToken: string) => {
    return authenticatedFetch<{ organization_id: string; message: string }>(
      `${API_BASE}/v1/invites/${inviteToken}/accept`,
      {
        method: "POST",
      },
    );
  },
};
