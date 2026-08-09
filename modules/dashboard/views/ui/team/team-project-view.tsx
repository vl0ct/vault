"use client";

import { usePathname } from "next/navigation";
import ProjectView from "@/modules/shared/components/project-view";

export default function TeamProjectView({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const pathname = usePathname();
  const teamId = pathname.split("/")[2];
  const basePath = pathname.split("/").slice(0, 3).join("/");

  return (
    <ProjectView
      projectSlug={projectSlug}
      projectType="TEAM"
      teamId={teamId}
      backPath={basePath}
    />
  );
}
