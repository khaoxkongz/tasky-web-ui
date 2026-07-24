import * as React from "react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@tasky-web-ui/ui/components/card";

import { TaskForm } from "@/components/task-form";
import { orpc } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
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
import { Button } from "@tasky-web-ui/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tasky-web-ui/ui/components/tooltip";
import {
  cn,
  formatCustomDate,
  getTaskDueDateColorClass,
  truncate,
} from "@tasky-web-ui/ui/lib/utils";
import {
  CalendarDaysIcon,
  CheckIcon,
  Edit2Icon,
  HashIcon,
  InboxIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

type TaskCardProps = {
  task: {
    completed: boolean;
    content: string;
    dueDate: Date | null;
    id: string;
    project: {
      aiTaskGen: boolean;
      colorHex: string;
      colorName: string;
      id: string;
      name: string;
      taskGenPrompt: string;
      userId: string;
    } | null;
    projectId: string | null;
    userId: string;
  };
} & React.ComponentProps<typeof Card>;

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [taskFormShow, setTaskFormShow] = React.useState(false);

  const { pathname } = useLocation();

  const { refetch } = useQuery(orpc.tasks.getInbox.queryOptions());
  const updateMutation = useMutation(
    orpc.tasks.update.mutationOptions({
      onSuccess: () => {
        refetch();
        setTaskFormShow(false);
      },
    })
  );

  const toggleMutation = useMutation(
    orpc.tasks.toggle.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  const removeMutation = useMutation(
    orpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  if (taskFormShow) {
    return (
      <TaskForm
        mode="edit"
        className="my-1"
        defaultValues={{
          ...task,
          dueDate: task.dueDate,
          projectId: task.projectId,
        }}
        onSubmit={(value) =>
          toast.promise(
            updateMutation.mutateAsync({
              id: task.id,
              content: value.content,
              dueDate: value.dueDate,
              projectId: value.projectId,
            }),
            {
              loading: "Updating task...",
              success: "Task updated successfully",
              error: "Failed to update task",
            }
          )
        }
        onCancel={() => setTaskFormShow(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setTaskFormShow(false);
          }
        }}
      />
    );
  }

  return (
    <div className="group/card relative grid grid-cols-[max-content_minmax(0,1fr)] gap-3 border-b">
      <Button
        size="icon"
        type="button"
        variant="outline"
        tabIndex={0}
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
        aria-describedby="task-content"
        className={cn(
          "group/button rounded-full size-5 mt-2",
          task.completed ? "bg-border" : "",
          className
        )}
        onClick={() =>
          toast.promise(
            toggleMutation.mutateAsync({
              id: task.id,
              completed: !task.completed,
            }),
            {
              loading: "Updating task...",
              success: "Task updated successfully",
              error: "Failed to update task",
              action: {
                label: "Undo",
                onClick: () =>
                  toast.promise(
                    toggleMutation.mutateAsync(
                      {
                        id: task.id,
                        completed: !task.completed,
                      },
                      {
                        onSuccess: () => {
                          refetch();
                        },
                      }
                    ),
                    {
                      loading: "Undoing...",
                      success: "Task undone successfully",
                      error: "Failed to undo task",
                    }
                  ),
              },
            }
          )
        }
      >
        <CheckIcon
          strokeWidth={4}
          className={cn(
            "size-3 text-muted-foreground group-hover/button:opacity-100 transition-opacity",
            task.completed ? "opacity-100" : "opacity-0"
          )}
        />
      </Button>

      <Card className="space-y-1.5 rounded-none border-none py-2" {...props}>
        <CardContent className="p-0">
          <p
            id="task-content"
            className={cn(
              "text-sm max-md:me-16",
              task.completed ? "text-muted-foreground line-through" : ""
            )}
          >
            {task.content}
          </p>
        </CardContent>

        <CardFooter className="flex gap-4 p-0">
          {pathname !== "/app/today" && task.dueDate ? (
            <div
              className={cn(
                "text-muted-foreground flex items-center gap-1 text-xs",
                getTaskDueDateColorClass(task.dueDate, task.completed)
              )}
            >
              <CalendarDaysIcon size={14} />
              {formatCustomDate(task.dueDate)}
            </div>
          ) : null}

          {pathname !== "/app/inbox" ||
          pathname !== `/app/projects/${task.projectId}` ? (
            <div className="text-muted-foreground ms-auto grid grid-cols-[minmax(0,180px)_max-content] items-center gap-1 text-xs">
              <div className="truncate text-right">
                {task.project?.name || "Inbox"}
              </div>
              {task.projectId ? (
                <HashIcon size={14} color={task.project?.colorHex} />
              ) : (
                <InboxIcon size={14} className="text-muted-foreground" />
              )}
            </div>
          ) : null}
        </CardFooter>
      </Card>

      <div className="bg-background absolute top-1.5 right-0 flex items-center gap-1 ps-1 opacity-0 shadow-[-10px_0px_5px_var(--background)] group-hover/card:opacity-100 focus-within:opacity-100 max-md:opacity-100">
        {task.completed ? null : (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground size-6"
                  aria-label="edit"
                  onClick={() => setTaskFormShow(true)}
                />
              }
            >
              <Edit2Icon />
            </TooltipTrigger>

            <TooltipContent>Edit task</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger
            onClick={() => setOpen(true)}
            render={
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-muted-foreground size-6"
                aria-label="delete"
              />
            }
          >
            <Trash2Icon />
          </TooltipTrigger>
          <TooltipContent>Delete task</TooltipContent>
        </Tooltip>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              The <strong>{truncate(task.content, 48)}</strong> task will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                toast.promise(removeMutation.mutateAsync({ id: task.id }), {
                  loading: "Deleting task...",
                  success: "Task removed successfully",
                  error: "Failed to remove task",
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
