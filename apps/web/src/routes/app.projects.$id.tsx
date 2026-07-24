import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

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
import { pageNotFound } from "@/assets";

function RouteComponent() {
  const { id } = Route.useParams();
  const [taskFormShow, setTaskFormShow] = React.useState(false);

  const { data, refetch } = useSuspenseQuery(
    orpc.projects.getById.queryOptions({ input: { id } })
  );
  const createMutation = useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: () => {
        refetch();
        setTaskFormShow(false);
      },
    })
  );

  const project = data?.at(0);
  const projectTasks = project?.tasks.filter((task) => !task.completed) ?? [];

  const handleTaskCancel = () => {
    setTaskFormShow(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleTaskCancel();
    }
  };

  const handleAddTask = (values: ITaskForm) => {
    toast.promise(
      createMutation.mutateAsync({
        ...values,
        projectId: id,
      }),
      {
        loading: "Creating task...",
        success: "Task created successfully",
        error: "Failed to create task",
      }
    );
  };

  if (!project) {
    return (
      <React.Fragment>
        <TopAppBar title="Project Not found" />

        <div className="container flex grow flex-col items-center justify-center">
          <figure className="mt-10">
            <img src={pageNotFound} alt="404 page not found" width="360" />
          </figure>

          <h1 className="mt-4 mb-2 text-center text-2xl font-semibold">
            Project not found
          </h1>
          <p className="text-muted-foreground max-w-[40ch] text-center">
            Uh-oh! No project matches this ID. Double-check it or explore other
            projects!
          </p>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <TopAppBar title={project.name} tasksCount={projectTasks.length} />

      <Page>
        <PageHeader>
          <PageTitle>{project.name}</PageTitle>

          {projectTasks.length > 0 ? (
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <CheckCircle2Icon size={16} className="size-4" />
              <span>{projectTasks.length} tasks</span>
            </div>
          ) : null}
        </PageHeader>

        <PageList>
          {projectTasks.length === 0 ? (
            <TaskEmptyState type="project" />
          ) : (
            projectTasks.map((task) => <TaskCard key={task.id} task={task} />)
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
                dueDate: null,
                projectId: id,
              }}
            />
          ) : null}
        </PageList>
      </Page>
    </React.Fragment>
  );
}

export const Route = createFileRoute("/app/projects/$id")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      context.orpc.projects.getById.queryOptions({ input: { id: params.id } })
    );

    const project = data?.at(0);

    if (!project) {
      return {
        project: null,
      };
    }

    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.project?.name ?? "Project"} - Tasky AI`,
      },
    ],
  }),
  component: RouteComponent,
  errorComponent: () => (
    <React.Fragment>
      <TopAppBar title="Project Not found" />

      <div className="container flex grow flex-col items-center justify-center">
        <figure className="mt-10">
          <img src={pageNotFound} alt="404 page not found" width="360" />
        </figure>

        <h1 className="mt-4 mb-2 text-center text-2xl font-semibold">
          Project not found
        </h1>
        <p className="text-muted-foreground max-w-[40ch] text-center">
          Uh-oh! No project matches this ID. Double-check it or explore other
          projects!
        </p>
      </div>
    </React.Fragment>
  ),
  notFoundComponent: () => (
    <React.Fragment>
      <TopAppBar title="Project Not found" />

      <div className="container flex grow flex-col items-center justify-center">
        <figure className="mt-10">
          <img src={pageNotFound} alt="404 page not found" width="360" />
        </figure>

        <h1 className="mt-4 mb-2 text-center text-2xl font-semibold">
          Project not found
        </h1>
        <p className="text-muted-foreground max-w-[40ch] text-center">
          Uh-oh! No project matches this ID. Double-check it or explore other
          projects!
        </p>
      </div>
    </React.Fragment>
  ),
  wrapInSuspense: true,
});
