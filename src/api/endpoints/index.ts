import app from "../app";
import { t } from "elysia";

import "./accounts";
import "./news";
import "./projects";
import "./proxy";
import "./users";

app.get(
  "/",
  {
    website: "localhost:4517",
    api: "localhost:4519",
    help: "help@example.com",
  },
  {
    detail: { summary: "サーバーの基本情報を返します" },
    response: t.Object({
      website: t.String({ format: "uri", description: "ウェブサイトURL" }),
      api: t.String({ format: "uri", description: "このAPIサーバーのURL" }),
      help: t.String({ format: "uri", description: "ヘルプ用メールアドレス" }),
    }),
  }
);
