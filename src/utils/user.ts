import { z } from "@hono/zod-openapi";
import { database } from "./db";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { tokenSchema } from "./login";
import { verify } from "hono/jwt";
import { key } from "./secret";

export const imagesSchema = z.object({
  "90x90": z.string().url(),
  "60x60": z.string().url(),
  "55x55": z.string().url(),
  "50x50": z.string().url(),
  "32x32": z.string().url(),
}).describe("アイコンURL")

export const getImages = (id: number): z.infer<typeof imagesSchema> => ({
  "90x90": `http://localhost:4514/user/${id}/90/`,
  "60x60": `http://localhost:4514/user/${id}/60/`,
  "55x55": `http://localhost:4514/user/${id}/55/`,
  "50x50": `http://localhost:4514/user/${id}/50/`,
  "32x32": `http://localhost:4514/user/${id}/32/`,
})

export const DBUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  birth_month: z.number(),
  birth_year: z.number(),
  scratchteam: z.number(),
  email: z.string().email(),
  password: z.string(),
  gender: z.string(),
  joined: z.number(),
  status: z.string(),
  bio: z.string(),
  country: z.string(),
  icon: z.instanceof(Uint8Array).or(z.string()).nullable(),
});

export const userSchema = z.object({
  id: z.number().describe("ユーザーID"),
  username: z.string().describe("ユーザー名"),
  scratchteam: z.boolean().describe("scratchteamかどうか"),
  history: z.object({
    joined: z.string().datetime().describe("ユーザー登録日時"),
  }),
  profile: z.object({
    id: z.number().describe("プロファイルID(よくわからん)"),
    images: imagesSchema,
    status: z.string().describe("ユーザーの「私が取り組んでいること」"),
    bio: z.string().describe("ユーザーの「私について」"),
    country: z.string().describe("ユーザーが住んでいる国")
  })
});

export const getUser = (name: string): z.infer<typeof DBUserSchema> | null => {
  const users = database.prepare("SELECT * FROM users WHERE name = ?").all(name);
  if(!users.length) return null;
  return DBUserSchema.parse(users[0]);
}

export const getUserWithID = (id: number): z.infer<typeof DBUserSchema> | null => {
  const users = database.query("SELECT * FROM users WHERE id = ?").all(id);
  if(!users.length) return null;
  return DBUserSchema.parse(users[0]);
}

export const getSigninedUser = async (c: Context): Promise<z.infer<typeof DBUserSchema> | null> => {
  const cookie = getCookie(c, "scratchsessionid") ?? c.req.header("X-Token");
  if(!cookie) return null;
  const payload = tokenSchema.safeParse(await verify(cookie, key.publicKey, "EdDSA").catch(()=>null));
  if(!payload.success) return null;

  const users = database.query("SELECT * FROM users WHERE name = ?").all(payload.data.aud);
  if(!users) return null;
  return DBUserSchema.parse(users[0]);
}
