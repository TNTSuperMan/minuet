import { z } from "@hono/zod-openapi";
import { database } from "./db";

export const DBProjectSchema = z.object({
  id: z.number(),
  author: z.number(),

  created: z.number(),
  modified: z.number(),
  shared: z.number().nullable(),

  title: z.string(),
  description: z.string(),
  instructions: z.string(),

  comments_allowed: z.number(),
  public: z.number(),
  thumbnail: z.instanceof(Uint8Array).nullable(),
  parent: z.number().nullable(),
  
  json: z.instanceof(Uint8Array).or(z.string())
})

export const getProject = (id: number): z.infer<typeof DBProjectSchema> | null => {
  const projects = database.prepare("SELECT * FROM projects WHERE id = ?").all(id);
  if(!projects.length) return null;
  return DBProjectSchema.parse(projects[0]);
}
