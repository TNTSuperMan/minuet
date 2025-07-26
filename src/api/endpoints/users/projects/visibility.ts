import { HTTPException } from "hono/http-exception";
import { getProject } from "../../../../utils/project";
import app from "../../../app";
import { z } from "@hono/zod-openapi";
import { getSigninedUser, getUser } from "../../../../utils/user";

app.openapi(
  {
    path: "/users/{usr}/projects/{id}/visibility",
    method: "get",
    description: "共有が可能か等の情報を取得する",
    request: {
      params: z.object({
        usr: z.string().describe("ユーザー名"),
        id: z.string().regex(/^\d+$/).describe("プロジェクトID"),
      }),
    },
    responses: {
      200: {
        description: "おｋ",
        content: {
          "application/json": {
            schema: z.object({
              censored: z.boolean().describe("検閲されているか"),
              censoredByAdmin: z.boolean().describe("管理者による検閲か"),
              censoredByCommunity: z.boolean().describe("大量報告による検閲か"),
              creatorId: z.number().describe("プロジェクト作成者"),
              deleted: z.boolean().describe("削除されたか"),
              messages: z.string().optional().describe("検閲メッセージ"),
              projectId: z.number().describe("対象のプロジェクトID"),
              reshareable: z.boolean().describe("再共有が可能か"),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    const { usr: _usr, id: _id } = c.req.valid("param");

    const usr = getUser(_usr);
    if (!usr) throw new HTTPException(403);

    const proj = getProject(parseInt(_id));
    if (!proj) throw new HTTPException(403);

    if (usr.id !== proj.author) throw new HTTPException(403);

    const currentUsr = await getSigninedUser(c);
    if (!currentUsr) throw new HTTPException(403);

    if (usr.id !== currentUsr.id) throw new HTTPException(403);

    // TODO: 報告機能が出来たらやる
    return c.json({
      censored: false,
      censoredByAdmin: false,
      censoredByCommunity: false,
      creatorId: proj.author,
      deleted: false,
      messages: "",
      projectId: proj.id,
      reshareable: true,
    });
  }
);
