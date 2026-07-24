import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.auth?.userId) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      auth: {
        userId: context.auth.userId,
      },
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
