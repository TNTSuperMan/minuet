import { resolve } from "path";

import { file } from "bun";

import routes from "../../scratch-www/src/routes.json" with { type: "json" };
import { ElysiaApp } from "../utils/app";

const fs_base = resolve(__dirname, "..", "..", "scratch-www", "build");
const routesMap = routes.map(
  (e) =>
    [
      e.name === "explore" ? /^\/explore\/(projects|studios)\/\w+\/?$/ : new RegExp(e.pattern),
      e.redirect ? e.redirect : file(resolve(fs_base, `${e.name}.html`)),
    ] as const
);

export const WWWPageRoutes = (app: ElysiaApp) =>
  app.all("*", async ({ path }) => {
    const p = resolve(fs_base, path.substring(1));
    const f = file(p);
    if (p.startsWith(fs_base) && (await f.exists())) return new Response(f);
    else {
      const route = routesMap.find((e) => e[0].test(path));
      if (!route) return null;
      else return typeof route[1] === "string" ? route[1] : new Response(route[1]);
    }
  });
