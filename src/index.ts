import { stdin } from "bun";
import { AnyElysia } from "elysia";

import apiApp from "./api";
import astApp from "./ast";
import prjApp from "./prj";
import resApp from "./res";
import wwwApp from "./www";

const listen = (app: AnyElysia, name: string, port: number) => {
  app.listen(port);
  stdin.write(`${name} server is running at http://localhost:${port}\n`);
};

listen(apiApp, "API", 4519);
listen(wwwApp, "WWW", 4517);
listen(prjApp, "Prj", 4513);
listen(resApp, "Res", 4514);
listen(astApp, "AST", 4518);
