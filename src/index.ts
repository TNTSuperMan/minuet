import { env, stdin } from "bun";
import { AnyElysia } from "elysia";

import apiApp from "./api";
import astApp from "./ast";
import prjApp from "./prj";
import resApp from "./res";
import wwwApp from "./www";

const listen = (app: AnyElysia, name: string, port: number) => {
  app.listen(port, (server) => {
    stdin.write(`${name} server is running at ${server.url.toString()}\n`);
  });
};

listen(apiApp, "API", parseInt(env.API_PORT ?? "") || 4519);
listen(wwwApp, "WWW", parseInt(env.WWW_PORT ?? "") || 4517);
listen(prjApp, "Prj", parseInt(env.PRJ_PORT ?? "") || 4513);
listen(resApp, "Res", parseInt(env.RES_PORT ?? "") || 4514);
listen(astApp, "AST", parseInt(env.AST_PORT ?? "") || 4518);
