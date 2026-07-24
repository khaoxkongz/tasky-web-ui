CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"color_name" text NOT NULL,
	"color_hex" text NOT NULL,
	"ai_task_gen" boolean DEFAULT false NOT NULL,
	"task_gen_prompt" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"content" text NOT NULL,
	"due_date" date,
	"completed" boolean DEFAULT false NOT NULL,
	"project_id" uuid,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL;