import { HTTPException } from "hono/http-exception";
import { validateUsername } from "../../../api/endpoints/accounts/checkusername";
import app from "../../app";
import { z } from "@hono/zod-openapi";
import { isValidPassword } from "../../../api/endpoints/accounts/checkpassword";
import { database } from "../../../utils/db";
import { password } from "bun";
import { sign } from "hono/jwt";
import { key } from "../../../utils/secret";

const formdataSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  birth_month: z.string().regex(/^\d+$/),
  birth_year: z.string().regex(/^\d+$/),
  under_16: z.enum(["true", "false"]),
  gender: z.string(),
  country: z.string(),
})

const dbReturnSchema = z.object({
  id: z.number()
})

app.openapi({
  path: "/accounts/register_new_user/", method: "post",
  description: "ユーザーを登録します",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: formdataSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.array(z.object({
            username: z.string().describe("登録したユーザー名"),
            user_id: z.number().describe("割り当てられたユーザーID"),
            success: z.boolean().describe("成功したか"),
            token: z.string().optional().describe("アクセストークン"),
            msg: z.string().describe("メッセージ(正常の場合\"user created\")"),
            logged_in: z.boolean().describe("そのユーザーにログインしたか(wwwで使われてない気がする)"),
          }))
        }
      }
    }
  }
}, async c => {
  const body = formdataSchema.parse(await c.req.parseBody());
  const usr_validate_res = validateUsername(body.username);
  if(usr_validate_res !== "valid username")
    throw new HTTPException(501, { message: "バリデーションが失敗したときの挙動はまだ☆" });
  if(!isValidPassword(body.password))
    throw new HTTPException(400, { message: "パスワードダメだお" });

  const { id } = dbReturnSchema.parse(database.query(`INSERT INTO users (
    name, birth_month, birth_year, scratchteam, email, password, gender, joined, status, bio, country
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING id`).get(
    body.username,
    parseInt(body.birth_month),
    parseInt(body.birth_year),
    0,
    body.email,
    await password.hash(body.password),
    body.gender,
    new Date().toISOString(),
    "", "", body.country
  ))

  return c.json([{
    username: body.username,
    user_id: id,
    success: true,
    token: await sign({
      username: body.username,
      exp: Math.floor(Date.now() / 1000) + (14*24*60*60)
    }, key.privateKey, "EdDSA"),
    msg: "user created",
    logged_in: true
  }])
})
