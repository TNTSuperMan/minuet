import { env, stdin } from "bun";
import { AnyElysia } from "elysia";

import apiApp from "./api";
import astApp from "./asset";
import prjApp from "./project";
import resApp from "./uploads";
import wwwApp from "./www";

const listen = (app: AnyElysia, name: string, port: number) => {
  app.listen(port, (server) => {
    stdin.write(`${name} server is running at ${server.url.toString()}\n`);
  });
};

listen(apiApp, "API", parseInt(env.API_PORT ?? "") || 4519);
listen(wwwApp, "WWW", parseInt(env.WWW_PORT ?? "") || 4517);
listen(prjApp, "Project", parseInt(env.PROJECT_PORT ?? "") || 4513);
listen(resApp, "Uploads", parseInt(env.STATIC_PORT ?? "") || 4514);
listen(astApp, "Asset", parseInt(env.ASSET_PORT ?? "") || 4518);
