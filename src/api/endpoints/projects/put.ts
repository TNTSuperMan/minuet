import { sql } from "bun";
import { t } from "elysia";

import { ElysiaApp } from "../../../utils/app";
import { getProject } from "../../../utils/project";
import { createExpire } from "../../../utils/secret";

import { getProjectData, projectDataSchema } from "./_util";

export const putProjectRoutes = (app: ElysiaApp) =>
  app.put(
    "/:id",
    async ({ user, status, body, params: { id }, jwt }) => {
      const proj = await getProject(parseInt(id));
      if (!user) {
        return status(401, "401 Unauthorized");
      }
      if (!proj || proj.author !== user.id) {
        return status(403, "403 Forbidden");
      }

      await sql`UPDATE projects SET title = ${body.title ?? proj.title}, description = ${
        body.description ?? proj.description
      }, instructions = ${body.instructions ?? proj.instructions} WHERE id = ${proj.id}`;

      return await getProjectData(
        proj,
        user,
        await jwt.sign({
          ...createExpire(60 * 5),
          id: proj.id,
          user: user.name,
        })
      );
    },
    {
      detail: { summary: "プロジェクトのタイトル等を変更します" },
      params: t.Object({
        id: t.String({ format: "regex", pattern: "^\\d+$", description: "プロジェクトID" }),
      }),
      body: t.Object({
        title: t.Optional(t.String({ description: "タイトル" })),
        description: t.Optional(t.String({ description: "メモとクレジット" })),
        instructions: t.Optional(t.String({ description: "使い方" })),
      }),
      response: {
        200: projectDataSchema,
        401: t.Literal("401 Unauthorized", { description: "ログインしていない場合のメッセージ" }),
        403: t.Literal("403 Forbidden", { description: "権限が無い場合のメッセージ" }),
      },
    }
  );
