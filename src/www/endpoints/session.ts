import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";

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
      admin: t.Boolean({ description: "管理者かどうか(よくわからん、モデレーター向け？)" }),
      educator: t.Boolean({ description: "教育者?" }),
      educator_invitee: t.Boolean(),
      invited_scratcher: t.Boolean({ description: "Scratcherに招待されているか?" }),
      mute_status: t.Object({}),
      new_scratcher: t.Boolean({ description: "NewScratcherかどうか" }),
      scratcher: t.Boolean({ description: "Scratcherかどうか" }),
      social: t.Boolean(),
      student: t.Boolean({ description: "生徒かどうか" }),
    }),
    user: t.Object({
      banned: t.Boolean({ description: "ブロックされているか" }),
      birthMonth: t.Number({ description: "誕生月" }),
      birthYear: t.Number({ description: "誕生年" }),
      dateJoined: t.String({ format: "date-time", description: "登録日時(ISO)" }),
      email: t.String({ format: "email", description: "メールアドレス" }),
      gender: t.String({ description: "性別" }),
      id: t.Number({ description: "ユーザーID" }),
      should_vpn: t.Boolean(),
      thumbnailUrl: t.String({ format: "uri", description: "アイコンURL" }),
      token: t.String({ description: "アクセストークン" }),
      username: t.String({ description: "ユーザー名" }),
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
    ({ user, cookie: { sessionid } }) => {
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
          thumbnailUrl: `http://localhost:4514/get_image/user/${user.id}_32x32.png`,
          token: sessionid.value!,
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
