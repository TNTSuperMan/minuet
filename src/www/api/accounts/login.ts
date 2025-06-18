import { password } from "bun";
import { database, DBUserSchema } from "../../../utils/db";
import app from "../../app";
import { z } from "@hono/zod-openapi";
import { verify } from "hono/jwt";
import { deleteCookie } from "hono/cookie";
import { secret } from "../../../utils/secret";

app.openapi({
  path: "/accounts/login/", method: "post",
  description: "ログインを試行します",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            username: z.string().describe("ログインするユーザー名"),
            password: z.string().describe("ログインするユーザーのパスワード"),
            useMessages: z.boolean(),
          })
        }
      }
    },
    headers: z.object({
      "X-csrftoken": z.string().describe("/csrf_token/のCookieで取得したCSRFトークン")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.array(z.object({
            id: z.number().optional().describe("ログインしたユーザーのID"),
            username: z.string().describe("ログインを試行したユーザー名"),
            messages: z.array(z.string()),
            num_tries: z.number(),
            success: z.number().describe("成功したか(0: false, 1: true)"),
            msg: z.string().describe("エラーメッセージ"),
            token: z.string().optional().describe("アクセストークン(成功した場合)")
          }))
        }
      }
    },
    403: {
      description: "CSRF検証の失敗",
      "text/plain": {
        schema: z.string().describe("「CSRF検証に失敗しました」というメッセージ")
      }
    }
  }
}, async c => {
  const { username, password: pass } = c.req.valid("json");
  const headers = c.req.valid("header");
  try{
    await verify(headers["X-csrftoken"], secret);
  }catch{
    deleteCookie(c, "scratchcsrftoken");
    return c.text("CSRF検証に失敗しました", 403)
  }

  const qres = database.query("SELECT * FROM users WHERE name = ?").all(username);
  if(!qres.length) return c.json([{
    username,
    messages: [],
    num_tries: 0,
    success: 0,
    msg: "ユーザー名またはパスワードが間違っています",
  }]);
  const user = DBUserSchema.parse(qres[0]);
  if(!await password.verify(pass, user.password)) return c.json([{
    username,
    messages: [],
    num_tries: 0,
    success: 0,
    msg: "ユーザー名またはパスワードが間違っています",
  }]);
  return c.json([{
    id: user.id,
    username,
    messages: [],
    num_tries: 0,
    success: 1,
    msg: "",
    token: "just a moment"
  }])
})
