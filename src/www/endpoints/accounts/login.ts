import { login } from "../../../utils/login";
import { ElysiaApp } from "../../../utils/app";
import { t } from "elysia";
import { verifyCSRF } from "../../../utils/csrf";
import { randomUUIDv7 } from "bun";
import { createExpire } from "../../../utils/secret";

export const accountsLoginRoutes = (app: ElysiaApp) =>
  app.use(verifyCSRF()).post(
    "/login/",
    async ({ jwt, cookie: { scratchsessionid }, body: { username, password } }) => {
      const loginResult = await login(username, password);

      switch (loginResult.type) {
        case "notFound":
        case "invalidPass":
          return [
            {
              username,
              messages: [],
              num_tries: 0,
              success: 0,
              msg: "ユーザー名またはパスワードが間違っています",
            },
          ];
        case "success":
          const token = await jwt.sign({
            jti: randomUUIDv7(),
            aud: loginResult.info.name,
            ...createExpire(14 * 24 * 60 * 60),
          });
          scratchsessionid.value = token;
          return [
            {
              id: loginResult.info.id,
              username,
              messages: [],
              num_tries: 0,
              success: 1,
              msg: "",
              token,
            },
          ];
      }
    },
    {
      detail: { summary: "ログインを試行します" },
      body: t.Object({
        username: t.String({ description: "ログインするユーザー名" }),
        password: t.String({ description: "ログインするユーザーのパスワード" }),
        useMessages: t.Boolean(),
      }),
      response: t.Tuple([
        t.Object({
          id: t.Optional(t.Number({ description: "ログインしたユーザーのID" })),
          username: t.String({ description: "ログインを試行したユーザー名" }),
          messages: t.Array(t.String()),
          num_tries: t.Number({ description: "ログインの試行回数(未実装)" }),
          success: t.Union([t.Literal(0), t.Literal(1)], {
            description: "ログインに成功したか(0: 失敗, 1: 成功)",
          }),
          msg: t.String({ description: "エラーメッセージ" }),
          token: t.Optional(t.String({ description: "アクセストークン(成功した場合)" })),
        }),
      ]),
    }
  );
