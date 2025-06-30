import { HTTPException } from "hono/http-exception";
import { database } from "../../utils/db";
import { getSigninedUser } from "../../utils/user";
import app from "../app";
import { z } from "@hono/zod-openapi";

import "./project";

const idSchema = z.object({
  id: z.number()
})

app.openapi({
  path: "/", method: "post",
  description: "新規プロジェクトの保存要求を実行します",
  request: {
    body: {
      description: "プロジェクトのJSONデータ",
      content: {
        "application/json": {
          schema: z.unknown().describe("スキーマ書くのはどうしても無理なので省略")
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
            "autosave-interval": z.string().regex(/^\d+$/).describe("自動保存間隔(120)"),
            "content-name": z.string().regex(/^\d+$/).describe("プロジェクトID"),
            "content-title": z.string().base64().describe("プロジェクトタイトルのBase64"),
            "status": z.string().describe("結果")
          })
        }
      }
    }
  }
}, async c => {
  const user = await getSigninedUser(c);
  if(!user) throw new HTTPException(403);

  const title = "Untitled_" + Date.now();

  const { id } = idSchema.parse(database.query(`INSERT INTO projects (
    author, created, modified, title, description, instructions, comments_allowed, public, json
  ) VALUES (?,?,?,?,?,?,?,?,?) RETURNING id`).get(
    user.id, Date.now(), Date.now(), title, "", "", 1, 0, await c.req.text()
  ))

  return c.json({
    "autosave-interval": "120",
    "content-name": id.toString(),
    "content-title": btoa(title),
    status: "success"
  });
})
