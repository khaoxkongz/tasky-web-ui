import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@tasky-web-ui/env/server";

import { relations } from "./schema/relations";

export function createDb() {
  return drizzle(env.DATABASE_URL, { relations });
}

export const db = createDb();
