import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tasky-web-ui/ui/components/alert-dialog";
import { truncate } from "@tasky-web-ui/ui/lib/utils";

import type { Project } from "@/types";
import { orpc } from "@/utils/orpc";

interface ProjectDeleteButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
}

export const ProjectDeleteButton: React.FC<ProjectDeleteButtonProps> = ({
  open,
  setOpen,
  project,
}) => {
  const { refetch } = useQuery(
    orpc.projects.getAll.queryOptions({
      input: { q: "" },
    })
  );

  const deleteMutation = useMutation(
    orpc.projects.delete.mutationOptions({
      onSuccess: async () => {
        setOpen(false);
        await refetch();
      },
    })
  );

  const handleDelete = async () => {
    toast.promise(deleteMutation.mutateAsync({ id: project.id }), {
      loading: "Deleting...",
      success: "Project deleted successfully",
      error: "Failed to delete project",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            The <strong>{truncate(project.name, 48)}</strong> project and all of
            its tasks will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
