import { CSRF } from "bun";
import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";
import { csrfSecret, csrfTokenExpire } from "../../utils/csrf";

export const csrfTokenRoutes = (app: ElysiaApp) =>
  app.get(
    "/csrf_token/",
    async ({ cookie: { csrftoken } }) => {
      csrftoken.value = await CSRF.generate(csrfSecret, {
        expiresIn: csrfTokenExpire,
      });
      return "";
    },
    {
      detail: { summary: "CSRFトークンを発行します" },
      response: t.String(),
    }
  );
