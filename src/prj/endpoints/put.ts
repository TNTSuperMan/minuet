import { HTTPException } from "hono/http-exception";
import { getProject } from "../../utils/project";
import { getSigninedUser } from "../../utils/user";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { database } from "../../utils/db";

app.openapi(
  {
    path: "/{id}",
    method: "put",
    description: "プロジェクトのJSONを返します",
    request: {
      params: z.object({
        id: z.string().regex(/^\d+$/).describe("プロジェクトID"),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
    },
    responses: {
      200: {
        description: "おｋ",
        content: {
          "application/json": {
            schema: z.object({
              status: z.string().describe("結果"),
              "autosave-interval": z.string().describe("保存間隔"),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    const { id } = c.req.valid("param");
    const proj = getProject(parseInt(id));
    const user = await getSigninedUser(c);

    if (!proj || !user || proj.author !== user.id) throw new HTTPException(403);

    const body = await c.req.json();

    database
      .query("UPDATE projects SET json = ?, modified = ? WHERE id = ?")
      .get(JSON.stringify(body), Date.now(), parseInt(id));

    return c.json({
      status: "ok",
      "autosave-interval": "120",
    });
  }
);
