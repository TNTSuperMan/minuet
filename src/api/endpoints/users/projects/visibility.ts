import { t } from "elysia";

import { getProject } from "../../../../utils/project";
import { getUser } from "../../../../utils/user";

import { UserProjectsElysiaApp } from ".";

export const userProjectsVisibilityRoutes = (app: UserProjectsElysiaApp) =>
  app.get(
    "/visivility",
    async ({ user, params: { usr, id }, set }) => {
      const param_user = await getUser(usr);
      if (!param_user) {
        set.status = 403;
        return "";
      }

      const proj = await getProject(parseInt(id));
      if (!proj) {
        set.status = 403;
        return "";
      }

      if (param_user.id !== proj.author) {
        set.status = 403;
        return "";
      }

      if (!user) {
        set.status = 403;
        return "";
      }

      if (user.id !== param_user.id) {
        set.status = 403;
        return "";
      }

      // TODO: 報告機能が出来たら進める
      return {
        censored: false,
        censoredByAdmin: false,
        censoredByCommunity: false,
        creatorId: proj.author,
        deleted: false,
        messages: "",
        projectId: proj.id,
        reshareable: true,
      };
    },
    {
      detail: { summary: "共有状態を取得します" },
      params: t.Object({
        usr: t.String({ description: "ユーザー名" }),
        id: t.String({
          pattern: "^\\d+$",
          description: "プロジェクトID",
          examples: ["119019019", "1"],
        }),
      }),
      response: {
        200: t.Object({
          censored: t.Boolean({ description: "検閲されているか" }),
          censoredByAdmin: t.Boolean({ description: "管理者による検閲か" }),
          censoredByCommunity: t.Boolean({ description: "大量報告による検閲か" }),
          creatorId: t.Number({ description: "プロジェクト作成者" }),
          deleted: t.Boolean({ description: "削除されたか" }),
          messages: t.Optional(t.String({ description: "検閲メッセージ" })),
          projectId: t.Number({ description: "対象のプロジェクトID" }),
          reshareable: t.Boolean({ description: "再共有が可能か" }),
        }),
        403: t.Literal(""),
      },
    }
  );
