"use client";

import * as React from "react";
import { notFound } from "next/navigation";

import { PROJECTS } from "@/lib/data";
import { ProjectSection } from "@/components/project-section";

type Params = {
  projectId: string;
  section: "tasks" | "issues" | "pull-requests" | "teams" | "members";
};

export default function ProjectSectionPage({ params }: { params: Params }) {
  const { projectId, section } = params;

  const exists = PROJECTS.some((p) => p.id === projectId);
  if (!exists) {
    notFound();
  }

  const allowedSections: Params["section"][] = [
    "tasks",
    "issues",
    "pull-requests",
    "teams",
    "members",
  ];

  const normalizedSection = allowedSections.includes(section)
    ? section
    : "tasks";

  return (
    <ProjectSection projectId={projectId} section={normalizedSection} />
  );
}

