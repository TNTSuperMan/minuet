import { file } from "bun";
import { NotFoundError, t } from "elysia";
import sharp from "sharp";

import { getUserWithID } from "../../utils/user";
import app from "../app";

const sample_icon = await file("./src/utils/sample.png").bytes();

const reg = /^(\d+)_(\d+)x\d+\.png$/;

app.get(
  "/get_image/user/:path",
  async ({ params: { path }, set }) => {
    const res = reg.exec(path);
    if(!res) throw new NotFoundError();
    const [, id, width] = res;

    const user = await getUserWithID(parseInt(id));
    if (!user) throw new NotFoundError();

    set.headers["content-type"] = "image/png";
    return await sharp(user.icon ?? sample_icon)
      .resize(parseInt(width))
      .toFormat("png")
      .toBuffer();
  },
  {
    params: t.Object({
      path: t.String({ pattern: "^(\\d+)_(\\d+)x\\d+\\.png$" }),
    }),
    detail: {
      summary: "ユーザーアイコンを取得します",
    },
  }
);
