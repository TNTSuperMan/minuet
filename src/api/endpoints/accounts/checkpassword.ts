import { t } from "elysia";

import { ElysiaApp } from "../../../utils/app";

export const isValidPassword = (password: string) =>
  password.length >= 6 && // パスワードの長さ判定
  password.toLowerCase() !== "password" && // passwordの大文字小文字の判定
  password !== "123456789".substring(0, password.length) && // 123...のような文字の判定
  password !== "0123456789".substring(0, password.length) && // 012...のような文字の判定
  password !== "abcdefghijklmnopqrstuvwxyz".substring(0, password.length); // abc...のような文字の判定

export const checkPasswordRoutes = (app: ElysiaApp) =>
  app.post(
    "/checkpassword",
    ({ body: { password } }) => ({
      msg: isValidPassword(password) ? "valid password" : "invalid password",
    }),
    {
      detail: { summary: "パスワードが適切かを返します" },
      body: t.Object({
        password: t.String({ description: "確認するパスワード" }),
      }),
      response: t.Object({
        msg: t.Union([t.Literal("valid password"), t.Literal("invalid password")], {
          description: 'パスワードが有効かどうかを"invalid password"か"valid password"で返す',
        }),
      }),
    }
  );
