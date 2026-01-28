"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "../lib/api";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Project {
  id: string;
  name: string;
  slug: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiProject {
  ID?: string;
  OrganizationID?: string;
  Name?: string;
  Slug?: string;
  id?: string;
  organization_id?: string;
  name?: string;
  slug?: string;
}

interface ProjectSelectorProps {
  apiBaseUrl: string;
  organizationId: string;
  selectedProjectId?: string;
  onProjectChange: (projectId: string) => void;
}

const normalizeProject = (project: ApiProject): Project => {
  const id = project.id ?? project.ID ?? "";
  const name =
    project.name ?? project.Name ?? project.slug ?? project.Slug ?? "";
  const slug = project.slug ?? project.Slug ?? "";
  const organization_id =
    project.organization_id ?? project.OrganizationID ?? "";

  return { id, name, slug, organization_id };
};

export default function ProjectSelector({
  apiBaseUrl,
  organizationId,
  selectedProjectId,
  onProjectChange,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl || !organizationId) {
      setProjects([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchProjects = async () => {
      try {
        const data = await authenticatedFetch<{ projects: ApiProject[] }>(
          `${apiBaseUrl}/v1/projects?organization_id=${organizationId}`,
          { signal: controller.signal },
        );

        const fetchedProjects = (data.projects || [])
          .map(normalizeProject)
          .filter((project) => project.id);
        setProjects(fetchedProjects);

        // Auto-select first project if none selected
        if (fetchedProjects.length > 0 && !selectedProjectId) {
          onProjectChange(fetchedProjects[0].id);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Failed to load projects",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, [apiBaseUrl, organizationId, selectedProjectId, onProjectChange]);

  if (loading) {
    return (
      <div className="text-xs text-(--text-muted)">Loading projects...</div>
    );
  }

  if (error) {
    return <div className="text-xs text-(--error)">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-xs text-(--text-muted)">No projects found</div>;
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="relative">
      <Label className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">
        Project
      </Label>
      <Select value={selectedProjectId || ""} onValueChange={onProjectChange}>
        <SelectTrigger className="mt-2 w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name} ({project.slug})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedProject && (
        <p className="mt-1 text-xs text-(--text-muted)">
          ID: {selectedProject.id.slice(0, 8)}...
        </p>
      )}
    </div>
  );
}
