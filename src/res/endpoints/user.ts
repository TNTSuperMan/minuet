import { file } from "bun";
import { NotFoundError, t } from "elysia";
import sharp from "sharp";

import { getUserWithID } from "../../utils/user";
import app from "../app";

const sample_icon = await file("./src/utils/sample.png").bytes();

app.get(
  "/user/:id/:width",
  async ({ params, set }) => {
    const { id, width } = params;

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
      id: t.String({ pattern: "^[0-9]+$" }),
      width: t.String({ pattern: "^[0-9]+$" }),
    }),
    detail: {
      summary: "ユーザーアイコンを取得します",
    },
  }
);
