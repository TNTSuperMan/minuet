import { NotFoundError, t } from "elysia";

import { sql } from "../../utils/db";
import app from "../app";

import { path_reg } from "./post";

app.get(
  "/internalapi/asset/:path/get/",
  async ({ params, set }) => {
    const { path } = params;
    const [, hash] = path_reg.exec(path)!;
    const hashbin = new Uint8Array(Buffer.from(hash, "hex"));

    const assets = await sql`SELECT * FROM assets WHERE hash = ${hashbin}` as {
      hash: Uint8Array;
      type: string;
      content: Uint8Array;
    }[];
    if (!assets.length) throw new NotFoundError();

    set.headers["content-type"] = assets[0].type;
    return assets[0].content;
  },
  {
    params: t.Object({
      path: t.String({ pattern: path_reg.source, description: "取得するパス" }),
    }),
  }
);
