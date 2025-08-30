import { sql } from "./db";

export interface DBProject {
  id: number;
  author: number;

  created: number;
  modified: number;
  shared: number | null;

  title: string;
  description: string;
  instructions: string;

  comments_allowed: 0 | 1;
  public: 0 | 1;
  thumbnail: Uint8Array | null;
  parent: number | null;

  json: string;
}

export const getProject = async (id: number): Promise<DBProject | null> => {
  const projects = await sql`SELECT * FROM projects WHERE id = ${id}` as [DBProject] | [];
  return projects[0] ?? null;
};
