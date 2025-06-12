import app from "../app";
import { z } from "@hono/zod-openapi";

app.openapi({
  path: "/session/", method: "get",
  description: "セッション情報(正直CSRFむずかちい)",
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.union([
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
              }).optional(),
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
              }).optional()
            })
          ])
        }
      }
    }
  }
}, c=>c.json({
  flags: {
    gallery_comments_enabled: false,
    project_comments_enabled: true,
    userprofile_comments_enabled: false,
  },
}))
