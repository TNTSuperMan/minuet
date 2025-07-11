import app from "../app";
import { path_reg } from "./post";
import { database } from "../../utils/db";
import { NotFoundError, t } from "elysia";

const assets_schema = t.Array(t.Object({
  hash: t.Uint8Array(),
  type: t.String(),
  content: t.Uint8Array()
}))

app.get("/internalapi/asset/:path/get/", ({ params, set }) => {
  const { path } = params;
  const [,hash] = path_reg.exec(path)!;
  const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

  const assets = database.prepare(`SELECT * FROM assets WHERE hash = ?`).all(hashbin) as any as typeof assets_schema.static;
  if(!assets.length) throw new NotFoundError();

  set.headers["content-type"] = assets[0].type;
  return assets[0].content;
}, {
  params: t.Object({
    path: t.String({ pattern: path_reg.source, description: "取得するパス" })
  })
})
