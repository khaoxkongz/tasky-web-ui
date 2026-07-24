import { and, eq, gte, isNotNull, isNull, lte } from "drizzle-orm";
import z from "zod/v4";

import { db } from "@tasky-web-ui/db";
import { tasks } from "@tasky-web-ui/db/schema/tasks";

import { startOfToday } from "date-fns";
import { protectedProcedure } from "../index";

const taskIdInput = z.object({
  id: z.uuid(),
});

const createTaskInput = z.object({
  content: z.string().trim().min(1),
  dueDate: z.date().nullable().optional(),
  projectId: z.uuid().nullable().optional(),
});

const updateTaskInput = taskIdInput.extend({
  content: z.string().trim().min(1),
  dueDate: z.date().nullable().optional(),
  projectId: z.uuid().nullable().optional(),
});

const toggleTaskInput = taskIdInput.extend({
  completed: z.boolean(),
});

export const taskRouter = {
  inboxCount: protectedProcedure.handler(async ({ context }) =>
    db.$count(
      tasks,
      and(
        eq(tasks.completed, false),
        isNull(tasks.projectId),
        eq(tasks.userId, context.auth.userId)
      )
    )
  ),

  todayCount: protectedProcedure.handler(async ({ context }) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return db.$count(
      tasks,
      and(
        eq(tasks.completed, false),
        isNotNull(tasks.dueDate),
        gte(tasks.dueDate, todayStart),
        lte(tasks.dueDate, todayEnd),
        eq(tasks.userId, context.auth.userId)
      )
    );
  }),

  upcomingCount: protectedProcedure.handler(async ({ context }) =>
    db.$count(
      tasks,
      and(
        eq(tasks.completed, false),
        isNotNull(tasks.dueDate),
        gte(tasks.dueDate, startOfToday()),
        eq(tasks.userId, context.auth.userId)
      )
    )
  ),

  completeCount: protectedProcedure.handler(async ({ context }) =>
    db.$count(
      tasks,
      and(eq(tasks.completed, true), eq(tasks.userId, context.auth.userId))
    )
  ),

  getInbox: protectedProcedure.handler(async ({ context }) =>
    db.query.tasks.findMany({
      where: {
        completed: false,
        projectId: {
          isNull: true,
        },
        userId: context.auth.userId,
      },
      with: {
        project: true,
      },
    })
  ),

  getToday: protectedProcedure.handler(async ({ context }) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    return db.query.tasks.findMany({
      where: {
        completed: false,
        userId: context.auth.userId,
        dueDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      with: {
        project: true,
      },
    });
  }),

  getUpcoming: protectedProcedure.handler(async ({ context }) =>
    db.query.tasks.findMany({
      where: {
        completed: false,
        dueDate: {
          isNotNull: true,
          gte: startOfToday(),
        },
        userId: context.auth.userId,
      },
      with: {
        project: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    })
  ),

  getCompleted: protectedProcedure.handler(async ({ context }) =>
    db.query.tasks.findMany({
      where: {
        completed: true,
        userId: context.auth.userId,
      },
      with: {
        project: true,
      },
    })
  ),

  create: protectedProcedure
    .input(createTaskInput)
    .handler(async ({ context, input }) =>
      db
        .insert(tasks)
        .values({
          content: input.content,
          dueDate: input.dueDate ?? null,
          projectId: input.projectId ?? null,
          userId: context.auth.userId,
        })
        .returning()
    ),

  update: protectedProcedure
    .input(updateTaskInput)
    .handler(async ({ context, input }) =>
      db
        .update(tasks)
        .set({
          content: input.content,
          dueDate: input.dueDate ?? null,
          projectId: input.projectId ?? null,
        })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, context.auth.userId))
        )
        .returning()
    ),

  toggle: protectedProcedure
    .input(toggleTaskInput)
    .handler(async ({ context, input }) =>
      db
        .update(tasks)
        .set({
          completed: input.completed,
        })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, context.auth.userId))
        )
        .returning()
    ),

  delete: protectedProcedure
    .input(taskIdInput)
    .handler(async ({ context, input }) =>
      db
        .delete(tasks)
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, context.auth.userId))
        )
        .returning()
    ),
};
