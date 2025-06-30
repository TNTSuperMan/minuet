import app from "../app";
import { z } from "@hono/zod-openapi";

import "./accounts";
import "./news";
import "./projects";
import "./projects/put";
import "./proxy";
import "./users";

app.openapi({
  path: "/", method: "get",
  description: "サーバーの基本情報を返します",
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            website: z.string().url().describe("Scratchウェブサイトに相当するURL"),
            api: z.string().url().describe("このAPIサーバーのURL"),
            help: z.string().email().describe("ヘルプ用メールアドレス")
          })
        }
      }
    }
  }
}, c => c.json({
  website: "localhost:4517",
  api: "localhost:4519",
  help: "help@example.com",
}));
