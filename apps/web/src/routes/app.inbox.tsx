import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

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
import type { TaskForm as ITaskForm } from "@/types";
import { orpc } from "@/utils/orpc";
import { Skeleton } from "@tasky-web-ui/ui/components/skeleton";
import { toast } from "sonner";

const TaskCardSkeleton = () => (
  <div className="group/card relative grid grid-cols-[max-content_1fr] items-center gap-3 border-b pt-2 pb-3.5">
    <Skeleton className="size-5 rounded-full" />
    <Skeleton className="size-4/5" />
  </div>
);

function RouteComponent() {
  const [taskFormShow, setTaskFormShow] = React.useState(false);

  const { data, isLoading, refetch } = useQuery(
    orpc.tasks.getInbox.queryOptions()
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
      <TopAppBar title="Inbox" tasksCount={20} />

      <Page>
        <PageHeader>
          <PageTitle>Inbox</PageTitle>
        </PageHeader>

        <PageList>
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))
          ) : !data || data?.length === 0 ? (
            <TaskEmptyState type="inbox" />
          ) : (
            data.map((task) => <TaskCard key={task.id} task={task} />)
          )}

          <TaskCreateButton onClick={() => setTaskFormShow(true)} />
          {taskFormShow ? (
            <TaskForm
              className="mt-1"
              mode="create"
              onKeyDown={handleKeyDown}
              onCancel={handleTaskCancel}
              onSubmit={handleAddTask}
            />
          ) : null}
        </PageList>
      </Page>
    </>
  );
}

export const Route = createFileRoute("/app/inbox")({
  head: () => ({
    meta: [
      {
        title: "Inbox - Tasky AI",
      },
    ],
  }),
  component: RouteComponent,
});
