import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { z } from "zod/v4";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { createContext } from "@tasky-web-ui/api/context";
import { appRouter } from "@tasky-web-ui/api/routers/index";
import { env } from "@tasky-web-ui/env/server";
import { GoogleGenAI } from "@google/genai/node";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter);

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context,
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  return next();
});

app.get("/", (c) => c.text("OK"));
app.post("/gen-ai", async (c) => {
  const input = await c.req.json();

  const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });

  const taskJsonSchemaConst = {
    type: "object",
    properties: {
      content: { type: "string", description: "Description of the task." },
      dueDate: {
        type: "string",
        description:
          "Due date of the tasks, or null if no specific due date is provided.",
      },
    },
    required: ["content", "dueDate"],
  } as const;

  const taskJsonSchema = {
    type: "array",
    items: {
      ...taskJsonSchemaConst,
      required: [...taskJsonSchemaConst.required] as string[],
    },
  } as const;

  const taskSchema = z.fromJSONSchema(taskJsonSchema);

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: `
    Generate and return a list of tasks based on the provided prompt and the given JSON schema
    Prompt: ${input.prompt}
    Task Schema:
    ${JSON.stringify(taskJsonSchema, null, 2)}
    Requirements:
    1. Ensure tasks align with the provided prompt.
    2 Set the 'dueDate' relative to todays date: ${new Date()}.
    3. Return an array of tasks matching the schema.
    Output: Array<Task>
    `,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: taskJsonSchema,
    },
  });

  const task = taskSchema.parse(JSON.parse(interaction.output_text || ""));
  return c.json(task);
});

export default app;
