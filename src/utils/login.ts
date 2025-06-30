import { password, randomUUIDv7 } from "bun";
import { database } from "./db"
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { genToken } from "./secret";
import { z } from "@hono/zod-openapi";
import { DBUserSchema, getUser } from "./user";

export const tokenSchema = z.object({
  jti: z.string(),
  aud: z.string()
})

export const login = async (c: Context, name: string, pass: string): Promise<{
  type: "notFound"
} | {
  type: "invalidPass"
} | {
  type: "success",
  token: string,
  info: z.infer<typeof DBUserSchema>
}> => {
  const user = getUser(name);
  if(!user) return { type: "notFound" };
  if(!await password.verify(pass, user.password)) return { type: "invalidPass" };

  const token = {
    jti: randomUUIDv7(),
    aud: user.name
  }
  
  setCookie(c, "scratchsessionid", await genToken(token, 14*24*60*60));

  return {
    type: "success",
    token: await genToken(token, 14*24*60*60),
    info: user
  }
}
