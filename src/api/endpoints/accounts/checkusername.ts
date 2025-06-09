import { database } from "../../../utils/db";
import app from "../../app";
import { z } from "@hono/zod-openapi";

const username_regex = /^[\da-zA-Z-_]{3,}$/;
const bad_regex = /(google|ggr|goog|gtm|youtube|gemini)/;

export const validateUsername = (username: string): "invalid username" | "bad username" | "username exists" | "valid username" => {
  const lowername = username.toLowerCase();
  if(!username_regex.test(lowername))
    return "invalid username";
  else if(bad_regex.test(lowername))
    return "bad username"
  else if(database.query(`SELECT * FROM users WHERE name = ?`).all(username).length)
    return "username exists";
  else return "valid username";
}

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
  const username = c.req.valid("param").usr;
  return c.json({
    msg: validateUsername(username),
    username
  })
})
