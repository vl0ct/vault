"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Edit,
  EllipsisVertical,
  FlaskConical,
  Pickaxe,
  Radio,
  Trash2,
  CircleArrowUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import DeleteProject from "@/modules/dashboard/views/ui/project/delete-project";
import type { ProjectType } from "./change-project-type";
import ProjectSettings from "./project-settings";

const projectTypes = {
  development: Pickaxe,
  production: Radio,
  test: FlaskConical,
} as const;

interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  envs?: any;
  updatedAt: string;
  slug: string;
}

interface ProjectCardProps {
  project: Project;
  viewType: "grid" | "list";
  projectType: "PERSONAL" | "TEAM";
  basePath?: string;
  teamId?: string;
}

export default function ProjectCard({
  project,
  viewType,
  projectType,
  basePath,
  teamId,
}: ProjectCardProps) {
  const Icon = projectTypes[project.type] ?? Pickaxe;
  const pathname = usePathname();

  const defaultBasePath =
    projectType === "PERSONAL"
      ? "/~/me"
      : pathname.split("/").slice(0, 3).join("/");

  const actualBasePath = basePath || defaultBasePath;

  return (
    <div
      className={cn(
        "bg-background border p-4 hover:border-foreground/30 transition rounded-lg",
        viewType === "grid"
          ? "grid gap-2"
          : "flex items-center justify-between border-b-0 last:border-b hover:border-b",
      )}
    >
      <div
        className={cn(
          "w-full",
          viewType === "list"
            ? "grid grid-cols-[1fr_auto_1fr] items-center"
            : "flex items-start justify-between",
        )}
      >
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-secondary/40 border hover:border-foreground/20"
              >
                <Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </TooltipContent>
          </Tooltip>

          <Link
            href={`${actualBasePath}/${project.slug}`}
            className="grid gap-1"
          >
            <h1 className="truncate text-nowrap text-sm font-medium hover:underline">
              {project.name}
            </h1>
            {project.description ? (
              <p className="truncate text-nowrap text-xs text-foreground/90 line-clamp-2">
                {project.description}
              </p>
            ) : (
              <p className="text-xs text-foreground/90 line-clamp-2">
                No description
              </p>
            )}
          </Link>
        </div>
        {viewType === "list" && (
          <div className="flex justify-center">
            <Badge variant="outline">
              <CircleArrowUp className="inline-start size-3" />
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </Badge>
          </div>
        )}
        <div
          className={cn(
            "flex items-center justify-end gap-1.5",
            viewType == "list" ? "mr-2" : "",
          )}
        >
          {viewType === "list" && (
            <p className="text-[11px] hidden sm:flex mr-4 text-foreground/80">
              Updated on {new Date(project.updatedAt).toDateString()}
            </p>
          )}
          {/*<Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon-sm" variant="ghost" onClick={handleCopyAll}>
                <Copy className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <EllipsisVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <p className="text-xs text-muted-foreground p-1">Actions</p>
              <DropdownMenuItem asChild>
                <ProjectSettings
                  slug={project.slug}
                  prevName={project.name}
                  prevDescription={project.description as string}
                  prevType={project.type}
                  projectType={projectType}
                  teamId={teamId}
                >
                  <Button
                    className="h-8 w-full justify-normal px-2! text-foreground/80 hover:text-foreground/90"
                    variant="ghost"
                  >
                    <Edit className="size-4! text-foreground/80" /> Edit
                  </Button>
                </ProjectSettings>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteProject
                  slug={project.slug}
                  projectType={projectType}
                  teamId={teamId}
                >
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-normal px-2! text-destructive/80 hover:text-destructive/90"
                  >
                    <Trash2 className="size-4! text-destructive/80" />
                    Delete
                  </Button>
                </DeleteProject>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {viewType === "grid" && (
        <div className="flex items-center justify-between pt-3 mt-3 border-t">
          <p className="text-[11px] text-muted-foreground">
            Updated on {new Date(project.updatedAt).toDateString()}
          </p>
          <Badge variant="outline">
            <CircleArrowUp className="inline-start size-3" />
            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
          </Badge>
        </div>
      )}
    </div>
  );
}
