import { NotFoundError, t } from "elysia";

import { optimizeImage } from "../../../utils/image";
import { getUserWithID } from "../../../utils/user";
import app from "../../app";

import { default_icon_base64 } from "./default" with { type: "macro" };

const default_icon = new Uint8Array(Buffer.from(default_icon_base64(), "base64"));

const reg = /^(\d+)_(\d+)x(\d+)\.png$/;

app.get(
  "/get_image/user/:path",
  async ({ params: { path }, set }) => {
    const res = reg.exec(path);
    if (!res) throw new NotFoundError();
    const [, id, width, height] = res;

    const user = await getUserWithID(parseInt(id));
    if (!user) throw new NotFoundError();

    set.headers["content-type"] = "image/png";
    return await optimizeImage({
      image: user.icon ?? default_icon,
      width: Math.min(parseInt(width), 1024),
      height: Math.min(parseInt(height), 1024),
      format: "png",
    });
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
