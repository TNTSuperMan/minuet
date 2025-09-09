import { NotFoundError } from "elysia";

import routes from "../../../minuet-www/src/routes.json" with { type: "json" };
import app from "../app";

const { default: files } = await (process.env.NODE_ENV === "production"
  ? import("./www_prod")
  : import("./www_dev"));

const routesMap = routes.map(
  (e) =>
    [
      e.name === "explore" ? /^\/explore\/(projects|studios)\/\w+\/?$/ : new RegExp(e.pattern),
      e.redirect ? e.redirect : `${e.name}.html`,
    ] as const
);

app.all("*", async ({ path }) => {
  const p = path.substring(1);
  if (p in files) return await files[p]!;
  else {
    const route = routesMap.find((e) => e[0].test(path));
    if (!route) throw new NotFoundError();
    else return await files[route[1]]!;
  }
});
