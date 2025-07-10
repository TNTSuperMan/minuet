import { ElysiaContext } from "./app";
import { database } from "./db";
import { t } from "elysia";

export const imagesSchema = t.Object({
  "90x90": t.String({ format: "uri" }),
  "60x60": t.String({ format: "uri" }),
  "55x55": t.String({ format: "uri" }),
  "50x50": t.String({ format: "uri" }),
  "32x32": t.String({ format: "uri" }),
}, { description: "アイコンURL" });

export const getImages = (id: number): typeof imagesSchema.static => ({
  "90x90": `http://localhost:4514/user/${id}/90/`,
  "60x60": `http://localhost:4514/user/${id}/60/`,
  "55x55": `http://localhost:4514/user/${id}/55/`,
  "50x50": `http://localhost:4514/user/${id}/50/`,
  "32x32": `http://localhost:4514/user/${id}/32/`,
})

export const DBUserSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  birth_month: t.Number(),
  birth_year: t.Number(),
  scratchteam: t.Number(),
  email: t.String({ format: "email" }),
  password: t.String(),
  gender: t.String(),
  joined: t.Number(),
  status: t.String(),
  bio: t.String(),
  country: t.String(),
  icon: t.Union([t.Uint8Array(), t.String()]),
});

export const userSchema = t.Object({
  id: t.Number({ description: "ユーザーID" }),
  username: t.String({ description: "ユーザー名" }),
  scratchteam: t.Boolean({ description: "scratchteamかどうか" }),
  history: t.Object({
    joined: t.String({ format: "date-time", description: "ユーザー登録日時" }),
  }),
  profile: t.Object({
    id: t.Number({ description: "プロファイルID(よくわからん)" }),
    images: imagesSchema,
    status: t.String({ description: "ユーザーの「私が取り組んでいること」" }),
    bio: t.String({ description: "ユーザーの「私について」" }),
    country: t.String({ description: "ユーザーが住んでいる国" })
  })
});

export const getUser = (name: string): typeof DBUserSchema.static | null => {
  const users = database.prepare("SELECT * FROM users WHERE name = ?").all(name);
  if(!users.length) return null;
  return DBUserSchema.parse(users[0]);
}

export const getUserWithID = (id: number): typeof DBUserSchema.static | null => {
  const users = database.query("SELECT * FROM users WHERE id = ?").all(id);
  if(!users.length) return null;
  return DBUserSchema.parse(users[0]);
}

export const deriveSigninedUser = async ({ cookie, headers, jwt }: ElysiaContext): Promise<{
  user?: typeof DBUserSchema.static | null
}> => {
  const key = cookie["scratchsessionid"].value ?? headers["X-Token"];
  if(!key) return {};

  const payload = await jwt.verify(key);
  if(!payload) return {};

  if(typeof payload.aud !== "string") return {}; 

  return { user: getUser(payload.aud) };
}
