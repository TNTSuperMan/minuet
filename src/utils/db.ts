import { Database } from "bun:sqlite";
import { z } from "@hono/zod-openapi";
import { resolve } from "path";

const database = new Database(resolve(__dirname, "db.db"), {
  create: true,
});

database.exec(`CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY,
  stamp    TEXT NOT NULL,
  headline TEXT NOT NULL,
  url      TEXT NOT NULL,
  image    TEXT NOT NULL,
  copy     TEXT NOT NULL
)`);

database.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE COLLATE NOCASE NOT NULL,
  scratchteam INTEGER NOT NULL,
  joined TEXT NOT NULL,
  profile_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  bio TEXT NOT NULL,
  country TEXT NOT NULL
)`);
export const DBUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  scratchteam: z.boolean(),
  joined: z.string().datetime(),
  profile_id: z.number(),
  status: z.string(),
  bio: z.string(),
  country: z.string(),
});

export { database };
