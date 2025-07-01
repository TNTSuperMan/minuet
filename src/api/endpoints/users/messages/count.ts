import app from "../../../app";
import { z } from "@hono/zod-openapi";

app.openapi({
  path: "/users/{usr}/messages/count", method: "get",
  description: "ユーザーの未読メッセージ数",
  request: {
    params: z.object({
      usr: z.string().describe("ユーザー名")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            count: z.number().describe("未読メッセージ数")
          })
        }
      }
    }
  } // TODO: メッセージ機能ができたらどうにかする
}, c => c.json({count: 0}));
