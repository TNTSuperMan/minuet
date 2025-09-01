import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";
import { createExpire } from "../../utils/secret";

const csrfTokenExpire = 365 * 24 * 60 * 60;

export const csrfTokenRoutes = (app: ElysiaApp) =>
  app.get(
    "/csrf_token/",
    async ({ cookie: { csrftoken }, jwt }) => {
      csrftoken.value = await jwt.sign(createExpire(csrfTokenExpire));
      return "";
    },
    {
      detail: { summary: "CSRFトークンを発行します" },
      response: t.String(),
    }
  );
