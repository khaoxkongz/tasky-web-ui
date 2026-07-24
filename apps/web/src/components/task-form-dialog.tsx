import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { startOfToday } from "date-fns";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tasky-web-ui/ui/components/dialog";
import { cn } from "@tasky-web-ui/ui/lib/utils";

import type { TaskForm as ITaskForm } from "@/types";
import { orpc } from "@/utils/orpc";

import { toast } from "sonner";
import { TaskForm } from "./task-form";

interface TaskFormDialogContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskFormDialogContext =
  React.createContext<TaskFormDialogContextProps | null>(null);

const useTaskFormDialog = () => {
  const contextValue = React.useContext(TaskFormDialogContext);

  if (!contextValue) {
    throw new Error(
      "useTaskFormDialogContext must be used within a TaskFormDialog"
    );
  }

  return contextValue;
};

export const TaskFormDialogContextProvider = ({
  open: openProp,
  setOpen: setOpenProp,
  children,
}: Partial<TaskFormDialogContextProps> & { children: React.ReactNode }) => {
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
    <TaskFormDialogContext.Provider value={contextValue}>
      {children}
    </TaskFormDialogContext.Provider>
  );
};

type TaskFormDialogProps = React.ComponentProps<typeof Dialog>;

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ ...props }) => {
  const { open, setOpen } = useTaskFormDialog();

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "q") {
        const target = e.target as HTMLElement;

        if (target.localName === "textarea") {
          return;
        }

        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, [setOpen]);

  return <Dialog open={open} onOpenChange={setOpen} {...props} />;
};

type TaskFormDialogTriggerProps = React.ComponentProps<typeof DialogTrigger>;

export const TaskFormDialogTrigger: React.FC<TaskFormDialogTriggerProps> = ({
  className,
  ...props
}) => <DialogTrigger className={cn("", className)} {...props} />;

type TaskFormDialogContentProps = React.ComponentProps<typeof DialogContent>;

export const TaskFormDialogContent: React.FC<TaskFormDialogContentProps> = ({
  className,
  ...props
}) => {
  const { pathname } = useLocation();
  const { setOpen } = useTaskFormDialog();

  const tasks = useQuery(orpc.tasks.getInbox.queryOptions());
  const createMutation = useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: () => {
        tasks.refetch();
        setOpen(false);
      },
    })
  );

  const handleAddTask = (values: ITaskForm) => {
    toast.promise(createMutation.mutateAsync(values), {
      loading: "Creating task...",
      success: "Task created successfully",
      error: "Failed to create task",
    });
  };

  return (
    <DialogContent className={cn("border-0 p-0", className)} {...props}>
      <TaskForm
        mode="create"
        defaultValues={{
          completed: false,
          content: "",
          dueDate: pathname === "/app/today" ? startOfToday() : null,
          projectId: null,
        }}
        onCancel={() => setOpen(false)}
        onSubmit={handleAddTask}
      />
    </DialogContent>
  );
};
