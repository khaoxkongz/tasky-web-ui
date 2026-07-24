import { createClerkClient } from "@clerk/backend";
import type { Context as HonoContext } from "hono";

import { env } from "@tasky-web-ui/env/server";

export interface ClerkContextAuth {
  userId: string;
}

export interface ClerkRequestContext {
  auth: ClerkContextAuth | null;
  session: null;
}

function toClerkContextAuth(
  auth: { userId: string | null } | null
): ClerkContextAuth | null {
  return auth?.userId ? { userId: auth.userId } : null;
}

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

async function authenticateClerkRequest(
  request: Request
): Promise<ClerkContextAuth | null> {
  const requestState = await clerkClient.authenticateRequest(request, {
    authorizedParties: [env.CORS_ORIGIN],
  });
  return toClerkContextAuth(requestState.toAuth());
}

export interface CreateContextOptions {
  context: HonoContext;
}

export async function createContext({
  context,
}: CreateContextOptions): Promise<ClerkRequestContext> {
  const clerkAuth = await authenticateClerkRequest(context.req.raw);
  return {
    auth: clerkAuth,
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
