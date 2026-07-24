import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  aiTaskGen: boolean("ai_task_gen").default(false).notNull(),
  taskGenPrompt: text("task_gen_prompt").default("").notNull(),
  userId: text("user_id").notNull(),
});
