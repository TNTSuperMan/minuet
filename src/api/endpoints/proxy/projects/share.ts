import { sql } from "bun";
import { t } from "elysia";

import { ElysiaApp } from "../../../../utils/app";
import { verifyCSRF } from "../../../../utils/csrf";
import { getProject } from "../../../../utils/project";

export const proxyShareProjectRoutes = (app: ElysiaApp) =>
  app.onBeforeHandle(verifyCSRF).put(
    "/proxy/projects/:id/share",
    async ({ params: { id }, user, status }) => {
      const proj = await getProject(parseInt(id));
      if (!user) {
        return status(401, "401 Unauthorized");
      }
      if (!proj || proj.author !== user.id) {
        return status(403, "403 Forbidden");
      }

      await sql`"UPDATE projects SET public = 1 WHERE id = ${proj.id}`;

      return { is_published: "true" as const };
    },
    {
      detail: { summary: "プロジェクトを共有します" },
      params: t.Object({
        id: t.String({ pattern: "^\\d+$", description: "プロジェクトID" }),
      }),
      headers: t.Object({
        "x-csrftoken": t.String({ description: "CSRFトークン" }),
      }),
      response: {
        200: t.Object({
          is_published: t.Union([
            t.Literal("true", { description: "公開されたか" }),
            t.Literal("false", { description: "公開されていない" }),
          ]),
        }),
        401: t.Literal("401 Unauthorized", { description: "ログインしていない場合のメッセージ" }),
        403: t.Literal("403 Forbidden", { description: "権限が無い場合のメッセージ" }),
      },
    }
  );
