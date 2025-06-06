import { z } from "@hono/zod-openapi";
import { database } from "../../utils/db";

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
  const usrdata = database.users[name.toLowerCase()];
  if(!usrdata) return null;

  return {
    id: usrdata.id,
    username: usrdata.username,
    scratchteam: usrdata.scratchteam,
    history: usrdata.history,
    profile: {
      id: usrdata.profile_id,
      images: usrdata.images,
      status: usrdata.status,
      bio: usrdata.bio,
      country: usrdata.country
    }
  }
}
