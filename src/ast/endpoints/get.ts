import app from "../app";
import { z } from "@hono/zod-openapi";
import { path_reg } from "./post";
import { database } from "../../utils/db";
import { HTTPException } from "hono/http-exception";

const assets_schema = z.array(z.object({
  hash: z.instanceof(Uint8Array),
  type: z.string(),
  content: z.instanceof(Uint8Array)
}))

app.openapi({
  path: "/internalapi/asset/{path}/get", method: "post",
  description: "アセットを取得します",
  request: {
    params: z.object({
      path: z.string().regex(path_reg).describe("取得するパス")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/octet-stream": {
          schema: z.string()
        }
      }
    }
  }
}, c => {
  const { path } = c.req.valid("param");
  const [,hash] = path_reg.exec(path)!;
  const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

  const assets = assets_schema.parse(database.prepare(`SELECT * FROM assets WHERE hash = ?`).all(hashbin));
  if(!assets.length) throw new HTTPException(404);

  return c.body(assets[0].content, 200, {
    "Content-type": assets[0].type
  });
})
