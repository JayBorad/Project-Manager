"use client";

import * as React from "react";
import { ProjectSection } from "@/components/project-section";

type Params = {
  projectId: string;
};

export default function ProjectMembersPage({ params }: { params: Promise<Params> }) {
  const asyncParams = React.use(params);
  const { projectId } = asyncParams;
  return <ProjectSection projectId={projectId} section="members" />;
}
