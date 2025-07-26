import { getProject } from "../../../../utils/project";
import { database } from "../../../../utils/db";
import { ElysiaApp } from "../../../../utils/app";
import { t } from "elysia";

export const useThumbnailPlugin = (app: ElysiaApp) =>
  app.post(
    "/thumbnail/:id/set/",
    async ({ params: { id }, body, user, set }) => {
      const proj = getProject(parseInt(id));

      if (!proj || !user || proj.author !== user.id) {
        set.status = 403;
        return "403 Forbidden";
      }

      const body_bytes = await body.bytes();

      database.query("UPDATE projects SET thumbnail = ? WHERE id = ?").get(body_bytes, proj.id);

      return {
        status: "success",
        "content-length": body_bytes.length,
        "content-name": proj.id.toString(),
        "autosave-internal": "120",
        "result-code": 0,
      };
    },
    {
      detail: { summary: "プロジェクトサムネイルを設定します" },
      body: t.File({ type: "image/png" }),
      param: t.Object({
        id: t.String({ description: "プロジェクトID" }),
      }),
      response: {
        200: t.Object({
          status: t.String({ description: "結果" }),
          "content-length": t.Number({ description: "サムネイルサイズ" }),
          "content-name": t.String({ description: "プロジェクトID" }),
          "autosave-internal": t.Literal("120"),
          "result-code": t.Number({ description: "返り値的なの" }),
        }),
        403: t.Literal("403 Forbidden"),
      },
    }
  );
