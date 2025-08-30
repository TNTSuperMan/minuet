import { password } from "bun";
import { t } from "elysia";

import { isValidPassword } from "../../../api/endpoints/accounts/checkpassword";
import { validateUsername } from "../../../api/endpoints/accounts/checkusername";
import { ElysiaApp } from "../../../utils/app";
import { sql } from "../../../utils/db";
import { createExpire } from "../../../utils/secret";

const formdataSchema = t.Object({
  username: t.String(),
  email: t.String({ format: "email" }),
  password: t.String(),
  birth_month: t.String({ pattern: "^\\d+$" }),
  birth_year: t.String({ pattern: "^\\d+$" }),
  under_16: t.Union([t.Literal("true"), t.Literal("false")]),
  gender: t.String(),
  country: t.String(),
});

export const accountsRegisterNewUserRoutes = (app: ElysiaApp) =>
  app.post(
    "/accounts/register_new_user/",
    async ({ jwt, body, set }) => {
      const usr_validate_res = await validateUsername(body.username);
      if (usr_validate_res !== "valid username") {
        set.status = 400;
        return [{ msg: "invalid username" }];
      }
      if (!isValidPassword(body.password)) {
        set.status = 400;
        return [{ msg: "invalid password" }];
      }

      const dbRes = (await sql`INSERT INTO users (
        name, birth_month, birth_year, scratchteam, email, password, gender, joined, status, bio, country
      ) VALUES (${body.username},${parseInt(body.birth_month)},${parseInt(body.birth_year)},${0},${body.email},${await password.hash(body.password)},${body.gender},${Date.now()},${""},${""},${body.country}) RETURNING id`) as {
        id: number;
      };

      return [
        {
          username: body.username,
          user_id: dbRes.id,
          success: true,
          token: await jwt.sign({
            ...createExpire(14 * 24 * 60 * 60),
            username: body.username,
          }),
          msg: "user created",
          logged_in: true,
        },
      ];
    },
    {
      detail: { summary: "ユーザーを登録します" },
      body: formdataSchema,
      response: t.Tuple([
        t.Union([
          t.Object({
            username: t.String({ description: "登録したユーザー名" }),
            user_id: t.Number({ description: "割り当てられたユーザーID" }),
            success: t.Boolean({ description: "成功したか" }),
            token: t.Optional(t.String({ description: "アクセストークン" })),
            msg: t.String({ description: 'メッセージ(正常の場合"user created")' }),
            logged_in: t.Boolean({
              description: "そのユーザーにログインしたか(wwwで使われてない気がする)",
            }),
          }),
          t.Object({
            msg: t.String({ description: 'メッセージ(正常の場合"user created")' }),
          }),
        ]),
      ]),
    }
  );
