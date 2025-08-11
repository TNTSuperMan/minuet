import { getProject } from "../../utils/project";
import app from "../app";
import { database } from "../../utils/db";
import { t } from "elysia";

app.put(
  "/:id",
  async ({ user, body, set, params: { id } }) => {
    const proj = getProject(parseInt(id));

    if (!proj || !user || proj.author !== user.id) {
      set.status = 403;
      return "";
    }

    const body_json = await body.json();

    database
      .query("UPDATE projects SET json = ?, modified = ? WHERE id = ?")
      .get(JSON.stringify(body_json), Date.now(), parseInt(id));

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
      403: t.String(),
    },
  }
);
