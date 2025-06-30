import { HTTPException } from "hono/http-exception";
import { getProject } from "../../../utils/project";
import { getSigninedUser } from "../../../utils/user";
import app from "../../app";
import { z } from "@hono/zod-openapi";
import { database } from "../../../utils/db";
import { getProjectData, projectDataSchema } from "./_util";

app.openapi({
  path: "/projects/:id", method: "put",
  description: "プロジェクトのタイトルを変更",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID")
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            title: z.string().describe("タイトル")
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
          schema: projectDataSchema
        }
      }
    }
  }
}, async c => {
  const proj = getProject(parseInt(c.req.valid("param").id));
  const user = await getSigninedUser(c);
  if(!proj || !user || proj.author !== user.id) throw new HTTPException(403);

  const { title } = c.req.valid("json");

  database.query(
    "UPDATE projects SET title = ? WHERE id = ?"
  ).get(title, proj.id);

  return c.json(await getProjectData(proj, user));
})
