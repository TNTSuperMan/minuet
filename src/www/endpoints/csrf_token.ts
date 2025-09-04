import { CSRF } from "bun";
import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";

export const csrfTokenExpire = 365 * 24 * 60 * 60;

export const csrfTokenRoutes = (app: ElysiaApp) =>
  app.get(
    "/csrf_token/",
    async ({ cookie: { csrftoken } }) => {
      csrftoken.value = await CSRF.generate(undefined, {
        expiresIn: csrfTokenExpire,
      });
      return "";
    },
    {
      detail: { summary: "CSRFトークンを発行します" },
      response: t.String(),
    }
  );
