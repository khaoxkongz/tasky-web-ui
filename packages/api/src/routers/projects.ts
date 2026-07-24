import { and, eq, like } from "drizzle-orm";
import z from "zod/v4";

import { db } from "@tasky-web-ui/db";
import { projects } from "@tasky-web-ui/db/schema/projects";

import { protectedProcedure } from "../index";

const projectsSearchInput = z.object({
  q: z.string().optional(),
});

const projectIdInput = z.object({
  id: z.uuid(),
});

const createProjectInput = z.object({
  name: z.string().trim().min(1),
  colorName: z.string().trim().min(1),
  colorHex: z.string().trim().min(1),
  aiTaskGen: z.boolean().optional(),
  taskGenPrompt: z.string().trim().normalize().optional(),
});

const updateProjectInput = projectIdInput.extend({
  name: z.string().trim().min(1),
  colorName: z.string().trim().min(1),
  colorHex: z.string().trim().min(1),
  aiTaskGen: z.boolean().optional(),
  taskGenPrompt: z.string().trim().nullable().optional(),
});

export const projectRouter = {
  getAll: protectedProcedure
    .input(projectsSearchInput)
    .handler(async ({ context, input }) =>
      db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.userId, context.auth.userId),
            input.q && input.q !== ""
              ? like(projects.name, `%${input.q}%`)
              : undefined
          )
        )
    ),

  getById: protectedProcedure
    .input(projectIdInput)
    .handler(async ({ context, input }) =>
      db.query.projects.findMany({
        where: {
          id: input.id,
          userId: context.auth.userId,
        },
        with: {
          tasks: {
            with: {
              project: true,
            },
            orderBy: {
              dueDate: "asc",
            },
          },
        },
      })
    ),

  create: protectedProcedure
    .input(createProjectInput)
    .handler(async ({ context, input }) =>
      db
        .insert(projects)
        .values({
          name: input.name,
          colorName: input.colorName,
          colorHex: input.colorHex,
          aiTaskGen: input.aiTaskGen ?? false,
          taskGenPrompt: input.taskGenPrompt ?? "",
          userId: context.auth.userId,
        })
        .returning()
    ),

  update: protectedProcedure
    .input(updateProjectInput)
    .handler(async ({ input, context }) =>
      db
        .update(projects)
        .set({
          name: input.name,
          colorName: input.colorName,
          colorHex: input.colorHex,
          aiTaskGen: input.aiTaskGen ?? false,
          taskGenPrompt: input.taskGenPrompt ?? "",
          userId: context.auth.userId,
        })
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, context.auth.userId)
          )
        )
        .returning()
    ),

  delete: protectedProcedure
    .input(projectIdInput)
    .handler(async ({ input, context }) =>
      db
        .delete(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.userId, context.auth.userId)
          )
        )
        .returning()
    ),
};
