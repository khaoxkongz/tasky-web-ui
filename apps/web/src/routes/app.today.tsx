import {
  Page,
  PageHeader,
  PageList,
  PageTitle,
} from "@/components/page-wrapper";
import { TaskCard } from "@/components/task-card";
import { TaskCreateButton } from "@/components/task-create-button";
import { TaskEmptyState } from "@/components/task-empty-states";
import { TaskForm } from "@/components/task-form";
import { TopAppBar } from "@/components/top-app-bar";
import { orpc } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import * as React from "react";

import type { TaskForm as ITaskForm } from "@/types";
import { Skeleton } from "@tasky-web-ui/ui/components/skeleton";
import { toast } from "sonner";
import { CheckCircle2Icon } from "lucide-react";
import { startOfToday } from "date-fns";

const TaskCardSkeleton = () => (
  <div className="group/card relative grid grid-cols-[max-content_1fr] items-center gap-3 border-b pt-2 pb-3.5">
    <Skeleton className="size-5 rounded-full" />
    <Skeleton className="size-4/5" />
  </div>
);

function RouteComponent() {
  const [taskFormShow, setTaskFormShow] = React.useState(false);
  const { data, isLoading, refetch } = useQuery(
    orpc.tasks.getToday.queryOptions()
  );
  const createMutation = useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: () => {
        refetch();
        setTaskFormShow(false);
      },
    })
  );

  const handleTaskCancel = () => {
    setTaskFormShow(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleTaskCancel();
    }
  };

  const handleAddTask = (values: ITaskForm) => {
    toast.promise(createMutation.mutateAsync(values), {
      loading: "Creating task...",
      success: "Task created successfully",
      error: "Failed to create task",
    });
  };

  return (
    <>
      <TopAppBar title="Today" />

      <Page>
        <PageHeader>
          <PageTitle>Today</PageTitle>

          {data && data.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <CheckCircle2Icon size={16} className="size-4" />
              <span>{data.length} tasks</span>
            </div>
          )}
        </PageHeader>

        <PageList>
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))
          ) : !data || data.length === 0 ? (
            <TaskEmptyState type="today" />
          ) : (
            data.map((task) => <TaskCard key={task.id} task={task} />)
          )}

          <TaskCreateButton onClick={() => setTaskFormShow(true)} />
          {taskFormShow ? (
            <TaskForm
              mode="create"
              className="mt-1"
              onKeyDown={handleKeyDown}
              onCancel={handleTaskCancel}
              onSubmit={handleAddTask}
              defaultValues={{
                content: "",
                dueDate: startOfToday(),
                projectId: null,
              }}
            />
          ) : null}
        </PageList>
      </Page>
    </>
  );
}

export const Route = createFileRoute("/app/today")({
  head: () => ({
    meta: [
      {
        title: "Today - Tasky AI",
      },
    ],
  }),
  component: RouteComponent,
});
