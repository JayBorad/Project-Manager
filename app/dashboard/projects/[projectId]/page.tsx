"use client";

import * as React from "react";
import { notFound } from "next/navigation";

import { PROJECTS } from "@/lib/data";
import { ProjectSection } from "@/components/project-section";

type Params = {
  projectId: string;
};

export default function ProjectDefaultPage({ params }: { params: Params }) {
  const { projectId } = params;

  const exists = PROJECTS.some((p) => p.id === projectId);
  if (!exists) {
    notFound();
  }

  return <ProjectSection projectId={projectId} section="tasks" />;
}

