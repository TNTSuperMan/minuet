import { setCookie } from "hono/cookie";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { genToken, secret } from "../../utils/secret";

app.openapi({
  path: "/csrf_token/", method: "get",
  description: "CSRFトークンを発行します",
  responses: {
    200: {
      description: "おｋ",
      content: {
        "text/plain": {
          schema: z.string()
        }
      }
    }
  }
}, async c => {
  setCookie(c, "scratchcsrftoken", await genToken({}, 365*24*60*60));
  return c.text("");
})
