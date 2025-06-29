import { z } from "@hono/zod-openapi";
import { database, DBUserSchema } from "./db";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { tokenSchema } from "./login";
import { verify } from "hono/jwt";
import { key } from "./secret";

export const userSchema = z.object({
  id: z.number().describe("ユーザーID"),
  username: z.string().describe("ユーザー名"),
  scratchteam: z.boolean().describe("scratchteamかどうか"),
  history: z.object({
    joined: z.string().datetime().describe("ユーザー登録日時"),
  }),
  profile: z.object({
    id: z.number().describe("プロファイルID(よくわからん)"),
    images: z.object({
      "90x90": z.string().url(),
      "60x60": z.string().url(),
      "55x55": z.string().url(),
      "50x50": z.string().url(),
      "32x32": z.string().url(),
    }).describe("アイコンURL"),
    status: z.string().describe("ユーザーの「私が取り組んでいること」"),
    bio: z.string().describe("ユーザーの「私について」"),
    country: z.string().describe("ユーザーが住んでいる国")
  })
});

export const getUser = (name: string): z.infer<typeof userSchema> | null => {
  const usrdata_raw = database.prepare("SELECT * FROM users WHERE name = ?").all(name);
  const { data: usrdata } = DBUserSchema.safeParse(usrdata_raw);
  if(!usrdata) return null;

  return {
    id: usrdata.id,
    username: usrdata.name,
    scratchteam: usrdata.scratchteam != 0,
    history: {
      joined: usrdata.joined
    },
    profile: {
      id: usrdata.id,
      images: {
        "90x90": `http://localhost:4514/user/${usrdata.id}/90/`,
        "60x60": `http://localhost:4514/user/${usrdata.id}/60/`,
        "55x55": `http://localhost:4514/user/${usrdata.id}/55/`,
        "50x50": `http://localhost:4514/user/${usrdata.id}/50/`,
        "32x32": `http://localhost:4514/user/${usrdata.id}/32/`,
      },
      status: usrdata.status,
      bio: usrdata.bio,
      country: usrdata.country
    }
  }
}

export const getLogginedUser = async (c: Context): Promise<z.infer<typeof DBUserSchema> | null> => {
  const cookie = getCookie(c, "scratchsessionid");
  if(!cookie) return null;
  const payload = tokenSchema.safeParse(await verify(cookie, key.publicKey, "EdDSA").catch(()=>null));
  if(!payload.success) return null;

  const users = database.query("SELECT * FROM users WHERE name = ?").all(payload.data.aud);
  if(!users) return null;
  return DBUserSchema.parse(users[0]);
}
