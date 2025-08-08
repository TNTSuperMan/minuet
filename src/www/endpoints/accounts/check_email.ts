import { t } from "elysia";
import { ElysiaApp } from "../../../utils/app";

const mailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const isValidEmail = (email: string) => {
  if (!mailRegexp.test(email)) return false;
  if (email.endsWith("@gmail.com")) return false;
  return true;
};

export const checkEmailRoutes = (app: ElysiaApp) =>
  app.get(
    "/check_email/",
    ({ query: { email } }) => ({
      msg: isValidEmail(email)
        ? "valid email"
        : "このアドレスにメールを送ることが許可されていません。",
      email,
    }),
    {
      detail: { summary: "有効なメールアドレスかを返します" },
      query: t.Object({
        email: t.String({ format: "email" }),
      }),
      response: t.Object({
        msg: t.String(),
        email: t.String({ format: "email" }),
      }),
    }
  );
