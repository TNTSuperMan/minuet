import { sql } from "bun";
import { t } from "elysia";

import app from "../app";

export const path_reg = /^([\da-f]{32})\.(\w+)$/;

const extensionMap: {
  [key: string]: string | void;
} = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "",
};

app.post(
  "/:name",
  async ({ user, params, status, body }) => {
    if (!user) {
      return status(401, "401 Unauthorized");
    }
    const { name } = params;
    const [, hash, ext] = path_reg.exec(name)!;

    const mime = extensionMap[ext];
    if (!mime) {
      return status(400, "400 Bad Request");
    }

    const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

    await sql`INSERT OR IGNORE INTO assets (hash, type, content) VALUES (${hashbin},${mime}, ${await body.bytes()})`;

    return {
      "content-name": `${hash}.${ext}`,
      status: "ok",
    };
  },
  {
    detail: {
      summary: "アセットを追加します",
    },
    params: t.Object({
      name: t.String({ pattern: path_reg.source }),
    }),
    body: t.File(),
    response: {
      200: t.Union([
        t.Object({
          "content-name": t.String({ description: "リソース名" }),
          status: t.String({ description: "結果(成功した場合ok)" }),
        }),
        t.String(),
      ]),
      400: t.Literal("400 Bad Request", { description: "MIMEタイプが不正な場合のメッセージです" }),
      401: t.Literal("401 Unauthorized", {
        description: "ログインされていない場合のメッセージです",
      }),
    },
  }
);
