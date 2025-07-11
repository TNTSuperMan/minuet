import app from "../app";
import { path_reg } from "./post";
import { database } from "../../utils/db";
import { getSchemaValidator, NotFoundError, t } from "elysia";

const assets_schema = t.Array(t.Object({
  hash: t.Uint8Array(),
  type: t.String(),
  content: t.Uint8Array()
}))
const parser = getSchemaValidator(assets_schema);

app.get("/internalapi/asset/:path/get/", ({ params, set }) => {
  const { path } = params;
  const [,hash] = path_reg.exec(path)!;
  const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

  const assets = parser.parse(database.prepare(`SELECT * FROM assets WHERE hash = ?`).all(hashbin));
  if(!assets.length) throw new NotFoundError();

  set.headers["content-type"] = assets[0].type;
  return assets[0].content;
}, {
  params: t.Object({
    path: t.String({ pattern: path_reg.source, description: "取得するパス" })
  })
})
