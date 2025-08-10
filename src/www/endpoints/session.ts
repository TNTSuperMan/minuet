import { ElysiaApp } from "../../utils/app";
import { t } from "elysia";

const responseSchema = t.Union([
  t.Object({
    flags: t.Object({
      gallery_comments_enabled: t.Boolean(),
      project_comments_enabled: t.Boolean(),
      userprofile_comments_enabled: t.Boolean(),
    }),
  }),
  t.Object({
    flags: t.Object({
      confirm_email_banner: t.Boolean(),
      everything_is_totally_normal: t.Boolean(),
      gallery_comments_enabled: t.Boolean(),
      has_outstanding_email_confirmation: t.Boolean(),
      must_complete_registration: t.Boolean(),
      must_reset_password: t.Boolean({ description: "生徒のパスワードをリセットするか" }),
      project_comments_enabled: t.Boolean(),
      show_welcome: t.Boolean(),
      unsupported_browser_banner: t.Boolean(),
      userprofile_comments_enabled: t.Boolean(),
      with_parent_email: t.Boolean(),
    }),
    permissions: t.Object({
      admin: t.Boolean().describe("管理者かどうか(よくわからん、モデレーター向け？)"),
      educator: t.Boolean().describe("教育者?"),
      educator_invitee: t.Boolean(),
      invited_scratcher: t.Boolean().describe("Scratcherに招待されているか?"),
      mute_status: t.Object({}),
      new_scratcher: t.Boolean().describe("NewScratcherかどうか"),
      scratcher: t.Boolean().describe("Scratcherかどうか"),
      social: t.Boolean(),
      student: t.Boolean().describe("生徒かどうか"),
    }),
    user: t.Object({
      banned: t.Boolean().describe("ブロックされているか"),
      birthMonth: t.Number().describe("誕生月"),
      birthYear: t.Number().describe("誕生年"),
      dateJoined: t.String().datetime().describe("登録日時(ISO)"),
      email: t.String().email().describe("メールアドレス"),
      gender: t.String().describe("性別"),
      id: t.Number().describe("ユーザーID"),
      should_vpn: t.Boolean(),
      thumbnailUrl: t.String().url().describe("アイコンURL"),
      token: t.String().describe("アクセストークン"),
      username: t.String().describe("ユーザー名"),
    }),
  }),
]);

const no_signin_response: typeof responseSchema.static = {
  flags: {
    gallery_comments_enabled: true,
    project_comments_enabled: true,
    userprofile_comments_enabled: true,
  },
};

export const sessionRoutes = (app: ElysiaApp) =>
  app.get(
    "/session/",
    ({ user, cookie }) => {
      if (!user) return no_signin_response;

      const response: typeof responseSchema.static = {
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
          with_parent_email: false,
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
          dateJoined: new Date(user.joined).toISOString(),
          email: user.email,
          gender: user.gender,
          id: user.id,
          should_vpn: false,
          thumbnailUrl: `http://localhost:4514/user/${user.id}/32/`,
          token: cookie.scratchsessionid.value!,
          username: user.name,
        },
      };
      return response;
    },
    {
      detail: { summary: "セッション情報を返します" },
      response: responseSchema,
    }
  );
