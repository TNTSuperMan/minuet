import app from "../app";
import { database } from "../../utils/db";
import { t } from "elysia";

export const path_reg = /^([\da-f]{32})\.(\w+)$/;

const extensionMap: {
  [key: string]: string | void
} = {
  "jpg": "image/jpeg",
  "jpeg":"image/jpeg",
  "png": "image/png",
  "svg": ""
}

app.post("/:name", async ({ user, params, set, body }) => {
  if(!user) {
    set.status = 403;
    return "403 Forbidden";
  }
  const { name } = params;
  const [, hash, ext] = path_reg.exec(name)!;

  const mime = extensionMap[ext];
  if(!mime) {
    set.status = 400;
    return "400 Bad Request";
  }
  
  const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

  database.query(`INSERT OR IGNORE INTO assets (hash, type, content) VALUES (?, ?, ?)`).get(
    hashbin, mime, await body.bytes()
  );

  return {
    "content-name": `${hash}.${ext}`,
    status: "ok"
  }
}, {
  detail: {
    summary: "アセットを追加します"
  },
  params: t.Object({
    name: t.String({ pattern: path_reg.source })
  }),
  body: t.File(),
  response: t.Union([t.Object({
    "content-name": t.String({ description: "リソース名" }),
    status: t.String({ description: "結果(成功した場合ok)" })
  }), t.String()])
})
