import { EditIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@tasky-web-ui/ui/components/button";
import { Dialog, DialogContent } from "@tasky-web-ui/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tasky-web-ui/ui/components/dropdown-menu";

import type { Project as IProject, ProjectForm as IProjectForm } from "@/types";
import { orpc } from "@/utils/orpc";

import { ProjectDeleteButton } from "./project-delete-button";
import { ProjectForm } from "./project-form";

type ProjectActionsMenuProps = {
  project: IProject;
} & React.ComponentProps<typeof DropdownMenuTrigger>;

export const ProjectActionsMenu: React.FC<ProjectActionsMenuProps> = ({
  project,
  children,
  ...props
}) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const { refetch } = useQuery(
    orpc.projects.getAll.queryOptions({
      input: { q: "" },
    })
  );

  const updateMutation = useMutation(
    orpc.projects.update.mutationOptions({
      onSuccess: async () => {
        setOpenEdit(false);
        await refetch();
      },
    })
  );

  const handleUpdate = async (data: IProjectForm) => {
    toast.promise(
      updateMutation.mutateAsync({
        ...data,
        id: project.id,
      }),
      {
        loading: "Updating...",
        success: "Project updated successfully",
        error: "Failed to update project",
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            render={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2"
              />
            }
          >
            <EditIcon size={16} className="size-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive! w-full justify-start px-2"
              />
            }
          >
            <Trash2Icon size={16} className="size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="rounded-xl! border-0 p-0">
          <ProjectForm
            mode="edit"
            defaultValues={project}
            onClose={() => setOpenEdit(false)}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>

      <ProjectDeleteButton
        open={openDelete}
        setOpen={setOpenDelete}
        project={project}
      />
    </>
  );
};
