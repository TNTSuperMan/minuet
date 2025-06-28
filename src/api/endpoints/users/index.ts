import app from "../../app";
import { HTTPException } from "hono/http-exception";
import { z } from "@hono/zod-openapi";
import { getUser, userSchema } from "../../../utils/user";

app.openapi({
  path: "/users/{usr}/", method: "get",
  description: "ユーザー情報を返します",
  request: {
    params: z.object({
      usr: z.string().describe("ユーザー名")
    })
  },
  responses: {
    200: {
      description: "ユーザーは存在します",
      content: {
        "application/json": {
          schema: userSchema
        }
      }
    }
  }
}, c => {
  const user = getUser(c.req.valid("param").usr);
  if(!user) throw new HTTPException(404);
  else return c.json(user);
})
