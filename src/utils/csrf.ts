import { CSRF } from "bun";
import Elysia from "elysia";

import { csrfTokenExpire } from "../www/endpoints/csrf_token";

export const verifyCSRF = () =>
  new Elysia().onBeforeHandle(({ cookie: { csrftoken }, headers }) => {
    if (
      !CSRF.verify(headers["x-csrftoken"] ?? "", {
        maxAge: csrfTokenExpire,
      })
    ) {
      csrftoken.remove();
      return new Response(null, { status: 403, statusText: "Forbidden" });
    }
  });
