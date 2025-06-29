import { getCookie } from "hono/cookie";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { verify } from "hono/jwt";
import { key } from "../../utils/secret";
import { database, DBUserSchema } from "../../utils/db";
import { tokenSchema } from "../../utils/login";

const responseSchema = z.union([
  z.object({
    flags: z.object({
      gallery_comments_enabled: z.boolean(),
      project_comments_enabled: z.boolean(),
      userprofile_comments_enabled: z.boolean(),
    })
  }),
  z.object({
    flags: z.object({
      confirm_email_banner: z.boolean(),
      everything_is_totally_normal: z.boolean(),
      gallery_comments_enabled: z.boolean(),
      has_outstanding_email_confirmation: z.boolean(),
      must_complete_registration: z.boolean(),
      must_reset_password: z.boolean().describe("生徒のパスワードをリセットするか"),
      project_comments_enabled: z.boolean(),
      show_welcome: z.boolean(),
      unsupported_browser_banner: z.boolean(),
      userprofile_comments_enabled: z.boolean(),
      with_parent_email: z.boolean(),
    }),
    permissions: z.object({
      admin: z.boolean().describe("管理者かどうか(よくわからん、モデレーター向け？)"),
      educator: z.boolean().describe("教育者?"),
      educator_invitee: z.boolean(),
      invited_scratcher: z.boolean().describe("Scratcherに招待されているか?"),
      mute_status: z.object({}),
      new_scratcher: z.boolean().describe("NewScratcherかどうか"),
      scratcher: z.boolean().describe("Scratcherかどうか"),
      social: z.boolean(),
      student: z.boolean().describe("生徒かどうか"),
    }),
    user: z.object({
      banned: z.boolean().describe("ブロックされているか"),
      birthMonth: z.number().describe("誕生月"),
      birthYear: z.number().describe("誕生年"),
      dateJoined: z.string().datetime().describe("登録日時(ISO)"),
      email: z.string().email().describe("メールアドレス"),
      gender: z.string().describe("性別"),
      id: z.number().describe("ユーザーID"),
      should_vpn: z.boolean(),
      thumbnailUrl: z.string().url().describe("アイコンURL"),
      token: z.string().describe("アクセストークン"),
      username: z.string().describe("ユーザー名")
    })
  })
])

const failed_response: z.infer<typeof responseSchema> = {
  flags: {
    gallery_comments_enabled: true,
    project_comments_enabled: true,
    userprofile_comments_enabled: true
  }
};

app.openapi({
  path: "/session/", method: "get",
  description: "セッション情報(正直CSRFむずかちい)",
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: responseSchema
        }
      }
    }
  }
}, async c=>{
  const cookie = getCookie(c, "scratchsessionid");
  if(!cookie) return c.json(failed_response);
  const payload = tokenSchema.safeParse(await verify(cookie, key.publicKey, "EdDSA").catch(()=>null));
  if(!payload.success) return c.json(failed_response);

  const users = database.query("SELECT * FROM users WHERE name = ?").all(payload.data.aud);
  if(!users) return c.json(failed_response);
  const user = DBUserSchema.parse(users[0]);

  const response: z.infer<typeof responseSchema> = {
    flags: {
      confirm_email_banner: false,
      everything_is_totally_normal: false,
      gallery_comments_enabled: true,
      has_outstanding_email_confirmation: false,
      must_complete_registration: false,
      must_reset_password: false,
      project_comments_enabled: true,
      show_welcome: true,
      unsupported_browser_banner: false,
      userprofile_comments_enabled: true,
      with_parent_email: false
    },
    permissions: {
      admin: false,
      educator: false,
      educator_invitee: false,
      invited_scratcher: false,
      mute_status: {},
      new_scratcher: true,
      scratcher: true,
      social: true,
      student: false,
    },
    user: {
      banned: false,
      birthMonth: user.birth_month,
      birthYear: user.birth_year,
      dateJoined: user.joined,
      email: user.email,
      gender: user.gender,
      id: user.id,
      should_vpn: false,
      thumbnailUrl: `http://localhost:4514/user/${user.id}/32/`,
      token: cookie,
      username: user.name
    }
  }
  return c.json(response);
})
