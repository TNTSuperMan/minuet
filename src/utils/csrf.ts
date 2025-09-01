import { CSRF } from "bun";
import Elysia from "elysia";

export const verifyCSRF = () =>
  new Elysia().onBeforeHandle(({ cookie: { csrftoken }, headers }) => {
    if (!CSRF.verify(headers["x-csrftoken"] ?? "")) {
      csrftoken.remove();
      return new Response(null, { status: 403, statusText: "Forbidden" });
    }
  });
