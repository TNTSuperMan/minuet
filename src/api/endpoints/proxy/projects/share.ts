import { getProject } from "../../../../utils/project";
import app from "../../../app";
import { z } from "@hono/zod-openapi"
import { getSigninedUser } from "../../../../utils/user";
import { HTTPException } from "hono/http-exception";
import { database } from "../../../../utils/db";
import { key } from "../../../../utils/secret";
import { verify } from "hono/jwt";
import { deleteCookie } from "hono/cookie";

app.openapi({
  path: "/proxy/projects/{id}/share", method: "put",
  description: "プロジェクトを共有します。",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID")
    }),
    headers: z.object({
      "X-csrftoken": z.string().describe("CSRFトークン")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            is_published: z.enum(["true","false"]).describe("公開されたか")
          })
        }
      }
    },
  }
}, async c => {
  const headers = c.req.valid("header");
  try{
    await verify(headers["X-csrftoken"], key.publicKey, "EdDSA");
  }catch{
    deleteCookie(c, "scratchcsrftoken");
    throw new HTTPException(403);
  }


  const proj = getProject(parseInt(c.req.valid("param").id));
  const user = await getSigninedUser(c);

  if(!proj || !user || proj.author !== user.id) throw new HTTPException(403);

  database.query(
    "UPDATE projects SET public = 1 WHERE id = ?"
  ).get(proj.id);

  return c.json({is_published: "true" as const});
})
