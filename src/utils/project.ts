import { database } from "./db";

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

const projectQuery = database.query("SELECT * FROM projects WHERE id = ?");

export const getProject = (id: number): DBProject | null => {
  const projects = projectQuery.get(id);
  return projects ?? (null as any);
};
