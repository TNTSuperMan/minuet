import { sql } from "bun";
import { t } from "elysia";

import { getProject } from "../../utils/project";
import app from "../app";

app.put(
  "/:id",
  async ({ user, body, status, params: { id } }) => {
    const proj = await getProject(parseInt(id));
    if (!user) {
      return status(401, "401 Unauthorized");
    }
    if (!proj || !user || proj.author !== user.id) {
      return status(403, "403 Forbidden");
    }

    const body_json = await body.json();

    await sql`UPDATE projects SET json = ${JSON.stringify(body_json)}, modified = ${Date.now()} WHERE id = ${parseInt(id)}`;

    return {
      status: "ok",
      "autosave-interval": "120" as const,
    };
  },
  {
    detail: { summary: "プロジェクトのJSONを更新します" },
    body: t.File({ type: "application/json" }),
    params: t.Object({
      id: t.String({ pattern: "^\\d+$", description: "プロジェクトID" }),
    }),
    response: {
      200: t.Object({
        status: t.String({ description: "結果" }),
        "autosave-interval": t.Literal("120"),
      }),
      401: t.Literal("401 Unauthorized", { description: "ログインしていない場合のメッセージ" }),
      403: t.Literal("403 Forbidden", { description: "権限が無い場合のメッセージ" }),
    },
  }
);
