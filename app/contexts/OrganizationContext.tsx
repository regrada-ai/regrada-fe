"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { authAPI, organizationAPI, Organization, User } from "../lib/api";

interface OrganizationContextType {
  user: User | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  currentOrganizationId: string | null;
  setCurrentOrganizationId: (id: string) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserAndOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const userResponse = await authAPI.me();
      setUser(userResponse.user);

      // Try to load organizations, but don't fail if endpoint doesn't exist
      try {
        const orgsResponse = await organizationAPI.list();
        setOrganizations(orgsResponse.organizations || []);

        // Set current organization from list if available
        if (!currentOrganizationId && orgsResponse.organizations.length > 0) {
          setCurrentOrganizationId(orgsResponse.organizations[0].id);
        }
      } catch (orgError) {
        // If organizations endpoint fails, just use empty array
        console.warn("Organizations endpoint not available:", orgError);
        setOrganizations([]);
      }

      // Always set current organization to user's default if not set
      if (!currentOrganizationId && userResponse.user.organization_id) {
        setCurrentOrganizationId(userResponse.user.organization_id);
      }
    } catch (err) {
      // Silently fail if user is not authenticated - this is expected on login/signup pages
      // 401 errors are normal and don't need to be logged or set as errors
      setUser(null);
      setOrganizations([]);
      setCurrentOrganizationId(null);

      // Only set error for non-401 errors
      const status =
        err && typeof err === "object" && "status" in err
          ? (err as { status?: number }).status
          : undefined;

      if (status !== 401) {
        setError(
          err instanceof Error ? err.message : "Failed to load user data",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load user and organizations on mount
  useEffect(() => {
    loadUserAndOrganizations();
  }, [loadUserAndOrganizations]);

  // Reload when navigating to protected routes (after login)
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/api-keys", "/invite"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname?.startsWith(route),
    );

    if (isProtectedRoute && !user && !loading) {
      loadUserAndOrganizations();
    }
  }, [pathname, user, loading, loadUserAndOrganizations]);

  const currentOrganization =
    organizations.find((org) => org.id === currentOrganizationId) || null;

  return (
    <OrganizationContext.Provider
      value={{
        user,
        organizations,
        currentOrganization,
        currentOrganizationId,
        setCurrentOrganizationId,
        refreshUser: loadUserAndOrganizations,
        loading,
        error,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  // Return null values if outside provider (for public pages)
  if (context === undefined) {
    return {
      user: null,
      organizations: [],
      currentOrganization: null,
      currentOrganizationId: null,
      setCurrentOrganizationId: () => {},
      refreshUser: async () => {},
      loading: false,
      error: null,
    };
  }
  return context;
}
