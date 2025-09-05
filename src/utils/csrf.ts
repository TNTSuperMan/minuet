import { CSRF } from "bun";
import { Context } from "elysia";

export const csrfTokenExpire = 365 * 24 * 60 * 60;
export const csrfSecret =
  process.env.CSRF_SECRET ?? crypto.getRandomValues(Buffer.alloc(64)).toBase64();

export const verifyCSRF = ({ cookie: { csrftoken }, headers }: Context) => {
  if (
    !CSRF.verify(headers["x-csrftoken"] ?? "", {
      secret: csrfSecret,
      maxAge: csrfTokenExpire,
    })
  ) {
    csrftoken.remove();
    return new Response(null, { status: 403, statusText: "Forbidden" });
  }
};
