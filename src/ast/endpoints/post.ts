import { HTTPException } from "hono/http-exception";
import { getSigninedUser } from "../../utils/user";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { database } from "../../utils/db";

export const path_reg = /^([\da-f]{32})\.(\w+)$/;

const extensionMap: {
  [key: string]: string | void
} = {
  "jpg": "image/jpeg",
  "jpeg":"image/jpeg",
  "png": "image/png",
  "svg": ""
}

app.openapi({
  path: "/{name}", method: "post",
  description: "アセットを追加します。",
  request: {
    params: z.object({
      name: z.string().regex(path_reg).describe("ファイル名")
    }),
    body: {
      content: {
        "application/octet-stream": {
          schema: z.string().describe("データ")
        }
      }
    }
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            "content-name": z.string().describe("名前"),
            status: z.string().describe("結果(ok)")
          })
        }
      }
    }
  }
}, async c => {
  if(!await getSigninedUser(c)) throw new HTTPException(403);
  const { name } = c.req.valid("param");
  const [, hash, ext] = path_reg.exec(name)!;

  const mime = extensionMap[ext];
  if(!mime) throw new HTTPException(400);
  
  const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

  database.query(`INSERT OR IGNORE INTO assets (hash, type, content) VALUES (?, ?, ?)`).get(
    hashbin, mime, await(await c.req.blob()).bytes()
  );

  return c.json({
    "content-name": `${hash}.${ext}`,
    status: "ok"
  })
})
