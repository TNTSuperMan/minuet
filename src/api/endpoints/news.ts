import { t } from "elysia";

import { ElysiaApp } from "../../utils/app";
import { sql } from "../../utils/db";

const newsSchema = t.Array(
  t.Object({
    id: t.Number({ description: "ニュースのID" }),
    stamp: t.String({ format: "date-time", description: "ニュースのタイムスタンプ" }),
    headline: t.String({ description: "タイトル" }),
    url: t.String({ format: "uri", description: "ニュースURL" }),
    image: t.String({ format: "uri", description: "説明画像" }),
    copy: t.String({ description: "説明" }),
  })
);

export const newsRoutes = (app: ElysiaApp) =>
  app.get(
    "/news",
    async ({ query: { limit, offset } }) =>
      (await sql`SELECT * FROM news LIMIT ${
        Math.min(parseInt(limit??"") || 20, 20)
      } OFFSET ${
       parseInt(offset??"") || 0}
      `) as typeof newsSchema.static,
    {
      detail: { summary: "ニュース情報を返します" },
      query: t.Object({
        limit: t.Optional(t.String({
          format: "regex",
          pattern: "^\\d+$",
          description: "表示数の最大(最大・デフォルト20)",
          examples: [20, 3],
        })),
        offset: t.Optional(t.String({
          format: "regex",
          pattern: "^\\d+$",
          description: "表示のオフセット",
          examples: [0, 3],
        })),
      }),
      response: newsSchema,
    }
  );
