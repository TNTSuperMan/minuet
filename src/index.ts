import Elysia from "elysia";
import apiApp from "./api";
import wwwApp from "./www";
import prjApp from "./prj";
import resApp from "./res";
import astApp from "./ast";

const listen = (app: Elysia<any, any>, name: string, port: number) => {
  app.listen(port);
  console.log(`${name} server is running at http://localhost:${port}`);
};

listen(apiApp, "API", 4519);
listen(wwwApp, "WWW", 4517);
listen(prjApp, "Prj", 4513);
listen(resApp, "Res", 4514);
listen(astApp, "AST", 4518);
