import app from "../../app";
import { database } from "../../../utils/db";
import { HTTPException } from "hono/http-exception";
import { getUser, userSchema } from "../../utils/user";

app.openapi({
  path: "/users/:usr/", method: "get",
  description: "ユーザー情報を返します",
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
  const user = getUser(c.req.query("usr")!);
  if(!user) throw new HTTPException(404);
  else return c.json(user);
})
