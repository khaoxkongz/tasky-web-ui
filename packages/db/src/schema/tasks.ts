import { boolean, date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";

import { projects } from "./projects";

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  dueDate: date("due_date", { mode: "date" }),
  completed: boolean("completed").default(false).notNull(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").notNull(),
});

export const taskSelectSchema = createSelectSchema(tasks);
export const taskInsertSchema = createInsertSchema(tasks);
export const taskUpdateSchema = createUpdateSchema(tasks);
