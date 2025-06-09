import app from "../../app";
import { z } from "@hono/zod-openapi"

export const isValidEmail = (email: string) => {
  if(email.endsWith("@gmail.com")) return false;
  return true;
}

app.openapi({
  path: "/accounts/check_email/", method: "get",
  description: "有効なメールアドレスかを返します",
  request: {
    query: z.object({
      email: z.string().email().describe("確認するメールアドレス"),
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.array(z.object({
            msg: z.string(),
            email: z.string().email(),
          }))
        }
      }
    }
  }
}, c => {
  const { email } = c.req.valid("query");
  if(isValidEmail(email)) return c.json([{
    msg: "valid email", email
  }]);
  else return c.json([{
    msg: "Scratchではこのアドレスにメールを送ることが許可されていません。",
    email
  }]);
})
