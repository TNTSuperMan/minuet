import app from "../app";
import { createExpire } from "../../utils/secret";
import { t } from "elysia";

const csrfTokenExpire = 365 * 24 * 60 * 60;

app.get("/csrf_token/", async ({ cookie, jwt }) => {
  cookie.scratchcsrftoken.value = await jwt.sign(createExpire(csrfTokenExpire));
  return "";
}, {
  detail: { summary: "CSRFトークンを発行します" },
  response: t.String()
})
