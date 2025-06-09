import app from "../../app";
import { z } from "@hono/zod-openapi";

export const isValidPassword = (password: string) => password.length >= 6 && // パスワードの長さ判定
    password.toLowerCase() !== "password" && // passwordの大文字小文字の判定
    password !==  "123456789".substring(0, password.length) && // 123...のような文字の判定
    password !== "0123456789".substring(0, password.length) && // 012...のような文字の判定
    password !== "abcdefghijklmnopqrstuvwxyz".substring(0, password.length) // abc...のような文字の判定 

app.openapi({
  path: "/accounts/checkpassword", method: "post",
  description: "パスワードが適切かを返す",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            password: z.string().describe("確認するパスワード")
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            msg: z.enum([
              "valid password",
              "invalid password"
            ])
          })
        }
      }
    }
  }
}, async c => isValidPassword(c.req.valid("json").password) ? c.json({
    msg: "valid password" as const
  }) : c.json({
    msg: "invalid password" as const
  })
)
