import { t } from "elysia";
import { database } from "./db";

export const DBProjectSchema = t.Object({
  id: t.Number(),
  author: t.Number(),

  created: t.Number(),
  modified: t.Number(),
  shared: t.Number().nullable(),

  title: t.String(),
  description: t.String(),
  instructions: t.String(),

  comments_allowed: t.Number(),
  public: t.Number(),
  thumbnail: t.Union([t.Uint8Array(), t.Null()]),
  parent: t.Union([t.Number(), t.Null()]),
  
  json: t.Union([t.Uint8Array(), t.String()])
})

export const getProject = (id: number): typeof DBProjectSchema.static | null => {
  const projects = database.prepare("SELECT * FROM projects WHERE id = ?").all(id);
  if(!projects.length) return null;
  return DBProjectSchema.parse(projects[0]);
}
