import { t } from "elysia";

import { UserMessagesRoutes } from ".";

export const userMessagesCountRoutes = (app: UserMessagesRoutes) =>
  app.get(
    "/count",
    ({}) => {
      // TODO: メッセージ機能ができたらどうにかする
      return { count: 0 };
    },
    {
      detail: { summary: "ユーザーの未読メッセージ数" },
      response: t.Object({
        count: t.Number({ description: "未読メッセージ数" }),
      }),
    }
  );
