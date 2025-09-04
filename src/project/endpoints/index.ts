import { sql } from "bun";
import { t } from "elysia";

import app from "../app";

import "./get";
import "./put";

app.post(
  "/",
  async ({ body, user, set }) => {
    if (!user) {
      set.status = 403;
      return "403 Forbidden";
    }

    const title = `Untitled_${Date.now()}`;

    const { id } = (await sql`INSERT INTO projects (
      author, created, modified, title, description, instructions, comments_allowed, public, json
    ) VALUES (${user.id},${Date.now()},${Date.now()},${title},${""},${""},${1},${0},${await body.text()}) RETURNING id`) as {
      id: number;
    };

    return {
      "autosave-interval": "120",
      "content-name": id.toString(),
      "content-title": btoa(title),
      status: "success",
    };
  },
  {
    detail: { summary: "新規プロジェクトの保存要求を実行します" },
    body: t.File({ type: "application/json", description: "プロジェクトのJSONデータ" }),
    response: {
      200: t.Object({
        "autosave-interval": t.Literal("120"),
        "content-name": t.String({ description: "プロジェクトID" }),
        "content-title": t.String({ description: "プロジェクトタイトルのBase64" }),
        status: t.String({ description: "結果(success等)" }),
      }),
      403: t.String(),
    },
  }
);
