import { database } from "../../../utils/db";
import app from "../../app";
import { z } from "@hono/zod-openapi";

const username_regex = /^[\da-zA-Z-_]{3,}$/;
const bad_regex = /(google|ggr|goog|gtm|youtube|gemini)/;

app.openapi({
  path: "/accounts/checkusername/{usr}/", method: "get",
  description: "新規ユーザー名として有効かどうかを返します",
  request: {
    params: z.object({
      usr: z.string().describe("ユーザー名")
    })
  },
  responses: {
    200: {
      description: "返ってきたよ",
      content: {
        "application/json": {
          schema: z.object({
            msg: z.enum([
              "valid username",
              "username exists",
              "bad username",
              "invalid username",
            ]).describe("有効かどうかの結果"),
            username: z.string().describe(":usrのユーザー名")
          })
        }
      }
    }
  }
}, c => {
  const username = c.req.param("usr")!;
  const lowername = username.toLowerCase();
  if(!username_regex.test(lowername)) return c.json({
    msg: "invalid username" as const,
    username
  });
  else if(bad_regex.test(lowername)) return c.json({
    msg: "bad username" as const,
    username
  });
  else if(database.query(`SELECT * FROM users WHERE name = ?`).all(username).length) return c.json({
    msg: "username exists" as const,
    username
  });
  else return c.json({
    msg: "valid username" as const,
    username
  });
})
