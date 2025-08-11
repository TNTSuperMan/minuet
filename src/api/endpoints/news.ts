import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";
import { database } from "../../utils/db";

const newsQuery = database.query("SELECT * FROM news LIMIT ? OFFSET ?");

export const newsRoutes = (app: ElysiaApp) =>
  app.get(
    "/news",
    ({ query: { limit, offset } }) =>
      newsQuery.all(Math.min(parseInt(limit) || 0, 20), parseInt(offset) || 0) as any,
    {
      detail: { summary: "ニュース情報を返します" },
      query: t.Object({
        limit: t.String({
          format: "regex",
          pattern: "^\\d+$",
          description: "表示数の最大(最大・デフォルト20)",
          examples: [20, 3],
        }),
        offset: t.String({
          format: "regex",
          pattern: "^\\d+$",
          description: "表示のオフセット",
          examples: [0, 3],
        }),
      }),
      response: t.Array(
        t.Object({
          id: t.Number({ description: "ニュースのID" }),
          stamp: t.String({ format: "date-time", description: "ニュースのタイムスタンプ" }),
          headline: t.String({ description: "タイトル" }),
          url: t.String({ format: "uri", description: "ニュースURL" }),
          image: t.String({ format: "uri", description: "説明画像" }),
          copy: t.String({ description: "説明" }),
        })
      ),
    }
  );
