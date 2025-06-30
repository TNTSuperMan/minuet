import { HTTPException } from "hono/http-exception";
import { getProject } from "../../../../utils/project";
import { getSigninedUser } from "../../../../utils/user";
import app from "../../../app";
import { z } from "@hono/zod-openapi";
import { database } from "../../../../utils/db";

app.openapi({
  path: "/internalapi/project/thumbnail/{id}/set/", method: "post",
  description: "プロジェクトサムネイルを設定します",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID"),
    }),
    body: {
      content: {
        "image/png": {
          schema: z.string().describe("PNGデータ")
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
            status: z.string().describe("結果"),
            "content-length": z.number().describe("サムネイルサイズ"),
            "content-name": z.string().describe("プロジェクトID"),
            "autosave-internal": z.string().describe("保存間隔?"),
            "result-code": z.number().describe("返り値的なの")
          })
        }
      }
    }
  }
}, async c => {
  const proj = getProject(parseInt(c.req.valid("param").id));
  const user = await getSigninedUser(c);

  if(!proj || !user || proj.author !== user.id) throw new HTTPException(403);

  const body = await(await c.req.blob()).bytes();

  database.query(
    "UPDATE projects SET thumbnail = ? WHERE id = ?"
  ).get(body, proj.id);

  return c.json({
    status: "success",
    "content-length": body.length,
    "content-name": proj.id.toString(),
    "autosave-internal": "120",
    "result-code": 0
  })
})
