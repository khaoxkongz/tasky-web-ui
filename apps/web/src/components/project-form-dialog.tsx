import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { Dialog, DialogContent } from "@tasky-web-ui/ui/components/dialog";
import { cn } from "@tasky-web-ui/ui/lib/utils";

import type { Project as IProject, ProjectForm as IProjectForm } from "@/types";
import { orpc } from "@/utils/orpc";

import { ProjectForm } from "./project-form";

const DEFAULT_PROJECT_NAME = "Untitled";
const _DEFAULT_PROJECT_COLOR_NAME = "Slate";
const DEFAULT_PROJECT_COLOR_HEX = "#64748b";

const DEFAULT_FORM_DATA: IProject = {
  id: "",
  name: DEFAULT_PROJECT_NAME,
  colorName: _DEFAULT_PROJECT_COLOR_NAME,
  colorHex: DEFAULT_PROJECT_COLOR_HEX,
};

interface ProjectFormDialogContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProjectFormDialogContext =
  React.createContext<ProjectFormDialogContextProps | null>(null);

const useProjectFormDialog = () => {
  const contextValue = React.useContext(ProjectFormDialogContext);

  if (!contextValue) {
    throw new Error(
      "useProjectFormDialog must be used within a ProjectFormDialog"
    );
  }

  return contextValue;
};

export const ProjectFormDialogContextProvider = ({
  open: openProp,
  setOpen: setOpenProp,
  children,
}: Partial<ProjectFormDialogContextProps> & { children: React.ReactNode }) => {
  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(false);
  const open = openProp || _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open, setOpen]
  );

  return (
    <ProjectFormDialogContext.Provider value={contextValue}>
      {children}
    </ProjectFormDialogContext.Provider>
  );
};

type ProjectFormDialogProps = React.ComponentProps<typeof Dialog>;

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  ...props
}) => {
  const { open, setOpen } = useProjectFormDialog();

  return <Dialog {...props} open={open} onOpenChange={setOpen} />;
};

type ProjectFormDialogContentProps = React.ComponentProps<typeof DialogContent>;

export const ProjectFormDialogContent: React.FC<
  ProjectFormDialogContentProps
> = ({ className, ...props }) => {
  const { setOpen } = useProjectFormDialog();

  const navigate = useNavigate();

  const { refetch } = useQuery(
    orpc.projects.getAll.queryOptions({ input: { q: "" } })
  );
  const createProjectMutation = useMutation(
    orpc.projects.create.mutationOptions()
  );

  const createTaskMutation = useMutation(orpc.tasks.create.mutationOptions());

  const handleAddProject = async (values: IProjectForm) => {
    await createProjectMutation.mutateAsync(values, {
      onSuccess: async (data) => {
        const {aiTaskGen} = values;
        const {taskGenPrompt} = values;

        const project = data.at(0);
        if (!project) {
          return;
        }

        const projectId = project.id;

        if (aiTaskGen) {
          const fetchGenAI = async () => {
            const response = await fetch("http://localhost:3000/gen-ai", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ prompt: taskGenPrompt }),
            });

            if (!response.status) {
              return;
            }

            const data = await response.json();
            return data;
          };

          const tasks = (await fetchGenAI()) as {
            content: string;
            dueDate: string;
          }[];

          if (tasks.length === 0) {
            return;
          }

          const promises = tasks.map((task) => 
            createTaskMutation.mutateAsync({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
              projectId,
            })
          );

          await Promise.all(promises);
        }

        setOpen(false);
        refetch();
        navigate({
          to: "/app/projects",
        });
      },
    });
  };

  return (
    <DialogContent
      className={cn("rounded-xl! border-0 p-0", className)}
      {...props}
    >
      <ProjectForm
        mode="create"
        defaultValues={DEFAULT_FORM_DATA}
        onClose={() => setOpen(false)}
        onSubmit={handleAddProject}
      />
    </DialogContent>
  );
};
