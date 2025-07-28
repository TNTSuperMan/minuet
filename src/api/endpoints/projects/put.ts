import { getProject } from "../../../utils/project";
import { database } from "../../../utils/db";
import { getProjectData, projectDataSchema } from "./_util";
import { ElysiaApp } from "../../../utils/app";
import { t } from "elysia";
import { createExpire } from "../../../utils/secret";

export const putProjectRoutes = (app: ElysiaApp) =>
  app.put(
    "/:id",
    async ({ user, set, body, params: { id }, jwt }) => {
      const proj = getProject(parseInt(id));
      if (!proj || !user || proj.author !== user.id) {
        set.status = 403;
        return "403 Forbidden";
      }

      database
        .query("UPDATE projects SET title = ?, description = ?, instructions = ? WHERE id = ?")
        .get(
          body.title ?? proj.title,
          body.description ?? proj.description,
          body.instructions ?? proj.instructions,
          proj.id
        );

      return await getProjectData(
        proj,
        user,
        await jwt.sign({
          ...createExpire(60 * 5),
          project: proj.id,
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
        403: t.String({ description: "403の旨" }),
        200: projectDataSchema,
      },
    }
  );
