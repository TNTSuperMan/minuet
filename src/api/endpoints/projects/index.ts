import { HTTPException } from "hono/http-exception";
import { getProject } from "../../../utils/project";
import { getSigninedUser, getUserWithID } from "../../../utils/user";
import app from "../../app";
import { z } from "@hono/zod-openapi";
import { getProjectData, projectDataSchema } from "./_util";

import "./put";

app.openapi({
  path: "/projects/:id", method: "get",
  description: "プロジェクトのメタデータを返します",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID")
    })
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
  if(!proj) throw new HTTPException(404);

  if(proj.public === 0){
    const user = await getSigninedUser(c);
    if(!user || proj.author !== user.id) throw new HTTPException(404);
  }

  const author = getUserWithID(proj.author)!;

  return c.json(await getProjectData(proj, author))
})
