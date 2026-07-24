import type { Project } from "@/types";
import { Link } from "@tanstack/react-router";
import { Button } from "@tasky-web-ui/ui/components/button";
import { cn } from "@tasky-web-ui/ui/lib/utils";
import { HashIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";
import { ProjectActionsMenu } from "./project-actions-menu";

type ProjectCardProps = React.ComponentProps<"div"> & {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  className,
  ...props
}) => 
  (
    <div
      key={project.id}
      className={cn(
        "group/card hover:bg-secondary relative flex h-14 items-center gap-3 rounded-lg px-2",
        className
      )}
      {...props}
    >
      <HashIcon
        size={16}
        color={project.colorHex}
        className="size-4 shrink-0"
      />

      <p className="max-w-[48ch] truncate text-sm">{project.name}</p>

      <ProjectActionsMenu
        project={project}
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative z-20 ms-auto shrink-0 opacity-0 group-hover/card:opacity-100 max-md:opacity-100"
            aria-label="More Actions"
          />
        }
      >
        <MoreHorizontalIcon />
      </ProjectActionsMenu>

      <Link
        to="/app/projects/$id"
        params={{ id: project.id }}
        className="absolute inset-0 z-10"
      />
    </div>
  )
;
