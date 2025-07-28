import { CSRF } from "bun";
import Elysia from "elysia";

export const verifyCSRF = () =>
  new Elysia().onBeforeHandle(({ cookie: { scratchcsrftoken }, headers }) => {
    if (!CSRF.verify(headers["x-csrftoken"] ?? "")) {
      scratchcsrftoken.remove();
      return new Response(null, { status: 403, statusText: "Forbidden" });
    }
  });
