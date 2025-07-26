import { t } from "elysia";
import { ElysiaApp } from "../../../utils/app";
import { database } from "../../../utils/db";

const username_regex = /^[\da-zA-Z-_]{3,20}$/;
const bad_regex = /(google|ggr|goog|gtm|youtube|gemini)/;

export const validateUsername = (
  username: string
): "invalid username" | "bad username" | "username exists" | "valid username" => {
  const lowername = username.toLowerCase();
  if (!username_regex.test(lowername)) return "invalid username";
  else if (bad_regex.test(lowername)) return "bad username";
  else if (database.query(`SELECT * FROM users WHERE name = ?`).all(username).length)
    return "username exists";
  else return "valid username";
};

export const checkUsernamePlugin = (app: ElysiaApp) =>
  app.get(
    "/checkusername/:username/",
    ({ params: { username } }) => ({ username, msg: validateUsername(username) }),
    {
      detail: { summary: "新規ユーザー名として有効かどうかを返します" },
      params: t.Object({
        username: t.String({ description: "確認するユーザー名" }),
      }),
      response: t.Object({
        username: t.String({ description: "確認したユーザー名" }),
        msg: t.Union(
          [
            t.Literal("invalid username"),
            t.Literal("bad username"),
            t.Literal("username exists"),
            t.Literal("valid username"),
          ],
          { description: "ユーザー名の有効かの情報" }
        ),
      }),
    }
  );
