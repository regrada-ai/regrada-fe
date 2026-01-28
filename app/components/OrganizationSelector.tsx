"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch, Organization } from "../lib/api";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface OrganizationSelectorProps {
  apiBaseUrl: string;
  selectedOrganizationId?: string;
  onOrganizationChange: (organizationId: string) => void;
}

export default function OrganizationSelector({
  apiBaseUrl,
  selectedOrganizationId,
  onOrganizationChange,
}: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl) {
      setOrganizations([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchOrganizations = async () => {
      try {
        const data = await authenticatedFetch<{ organizations: Organization[] }>(
          `${apiBaseUrl}/v1/organizations`,
          { signal: controller.signal },
        );

        const fetchedOrganizations = data.organizations || [];
        setOrganizations(fetchedOrganizations);

        // Auto-select first organization if none selected
        if (fetchedOrganizations.length > 0 && !selectedOrganizationId) {
          onOrganizationChange(fetchedOrganizations[0].id);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Failed to load organizations",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOrganizations();

    return () => controller.abort();
  }, [apiBaseUrl, selectedOrganizationId, onOrganizationChange]);

  if (loading) {
    return (
      <div className="text-xs text-(--text-muted)">Loading organizations...</div>
    );
  }

  if (error) {
    return <div className="text-xs text-(--error)">{error}</div>;
  }

  if (organizations.length === 0) {
    return <div className="text-xs text-(--text-muted)">No organizations found</div>;
  }

  const selectedOrganization = organizations.find(
    (o) => o.id === selectedOrganizationId,
  );

  return (
    <div className="relative">
      <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
        Organization
      </Label>
      <Select
        value={selectedOrganizationId || ""}
        onValueChange={onOrganizationChange}
      >
        <SelectTrigger className="mt-2 w-full">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name} ({org.slug})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOrganization && (
        <p className="mt-1 text-xs text-(--text-muted)">
          Tier: {selectedOrganization.tier}
        </p>
      )}
    </div>
  );
}
