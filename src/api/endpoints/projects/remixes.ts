import { t } from "elysia";

import { ElysiaApp } from "../../../utils/app";

import { projectDataSchema } from "./_util";

export const projectsRemixesRoutes = (app: ElysiaApp) =>
  app.get(
    "/:id/remixes",
    () => [], // いつか実装する
    {
      detail: { summary: "プロジェクトのリミックスリストを取得します" },
      query: t.Object({
        limit: t.String({ pattern: "^\\d+$", format: "regex", description: "表示上限" }),
      }),
      responses: t.Array(projectDataSchema),
    }
  );
