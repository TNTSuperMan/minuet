import { setCookie } from "hono/cookie";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { sign } from "hono/jwt";
import { secret } from "../../utils/secret";

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
  setCookie(c, "scratchcsrftoken", await sign({
    exp: Math.floor(Date.now() / 1000) + (365*24*60*60)
  }, secret, "EdDSA"));
  return c.text("");
})
