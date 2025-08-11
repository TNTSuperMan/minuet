import { t } from "elysia";

import app from "../app";

import { accountsRoutes } from "./accounts";
import { newsRoutes } from "./news";
import { projectsRoutes } from "./projects";
import { proxyRoutes } from "./proxy";
import { userRoutes } from "./users";

app
  .use(accountsRoutes)
  .use(newsRoutes)
  .use(projectsRoutes)
  .use(proxyRoutes)
  .use(userRoutes)
  .get(
    "/",
    () => ({
      website: "localhost:4517",
      api: "localhost:4519",
      help: "help@example.com",
    }),
    {
      detail: { summary: "サーバーの基本情報を返します" },
      response: t.Object({
        website: t.String({ format: "uri", description: "ウェブサイトURL" }),
        api: t.String({ format: "uri", description: "このAPIサーバーのURL" }),
        help: t.String({ format: "email", description: "ヘルプ用メールアドレス" }),
      }),
    }
  );
