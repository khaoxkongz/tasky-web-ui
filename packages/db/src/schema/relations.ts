import { defineRelations } from "drizzle-orm";

import { projects } from "./projects";
import { tasks } from "./tasks";

export const relations = defineRelations(
  {
    projects,
    tasks,
  },
  ({ many, one, projects: projectsTable, tasks: tasksTable }) => ({
    projects: {
      tasks: many.tasks({
        from: projectsTable.id,
        to: tasksTable.projectId,
      }),
    },
    tasks: {
      project: one.projects({
        from: tasksTable.projectId,
        optional: true,
        to: projectsTable.id,
      }),
    },
  })
);
