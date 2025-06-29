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
  birth_month INTEGER NOT NULL,
  birth_year  INTEGER NOT NULL,
  scratchteam INTEGER NOT NULL,
  email    TEXT NOT NULL,
  password TEXT NOT NULL,
  gender   TEXT NOT NULL,
  joined   TEXT NOT NULL,
  status   TEXT NOT NULL,
  bio      TEXT NOT NULL,
  country  TEXT NOT NULL,
  icon     BLOB
)`);
export const DBUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  birth_month: z.number(),
  birth_year: z.number(),
  scratchteam: z.number(),
  email: z.string().email(),
  password: z.string(),
  gender: z.string(),
  joined: z.string().datetime(),
  status: z.string(),
  bio: z.string(),
  country: z.string(),
  icon: z.instanceof(Uint8Array).nullable(),
});

export { database };
