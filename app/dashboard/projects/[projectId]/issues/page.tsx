"use client";

import * as React from "react";
import { ProjectSection } from "@/components/project-section";

type Params = {
  projectId: string;
};

export default function ProjectIssuesPage({ params }: { params: Promise<Params> }) {
  const { projectId } = React.use(params);
  return <ProjectSection projectId={projectId} section="issues" />;
}
