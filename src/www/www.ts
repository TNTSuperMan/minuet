import { resolve } from "path";
import app from "./app";
import routes from "./scratch-www/src/routes.json" with { type: "json" };
import { file } from "bun";
import { HTTPException } from "hono/http-exception";

const fs_base = resolve(__dirname, "scratch-www", "build");
const routesMap = routes.map(e=>[
    e.name == "explore" ? /^\/explore\/(projects|studios)\/\w+\/?$/ :
    new RegExp(e.pattern),
  e.redirect ? e.redirect : file(resolve(
    fs_base, `${e.name}.html`))
] as const)

app.notFound(async c=>{
  const p = resolve(fs_base, c.req.path.substring(1));
  const f = file(p);
  if(p.startsWith(fs_base) && await f.exists())
    return new Response(f);
  else{
    const route = routesMap.find(e=>e[0].test(c.req.path));
    if(!route) throw new HTTPException(404);
    else return typeof route[1] === "string" ? c.redirect(route[1]) : new Response(route[1])
  }
});
