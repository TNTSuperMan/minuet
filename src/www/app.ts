import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { file } from "bun";
import { HTTPException } from "hono/http-exception";
import { resolve } from "path";
import routes from "./scratch-www/src/routes.json" with { type: "json" };

const fs_base = resolve(__dirname, "scratch-www", "build");
const routesMap = routes.map(e=>[
    e.name == "explore" ? /^\/explore\/(projects|studios)\/\w+\/?$/ :
    new RegExp(e.pattern),
  e.redirect ? e.redirect : file(resolve(
    fs_base, `${e.name}.html`))
] as const)

const app = new OpenAPIHono({ strict: false });

app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    title: "WWW document",
    version: "1.0.0"
  }
}).get("/docs", swaggerUI({
  url: "/spec"
}));

app.onError((e,c)=>{
  if(e instanceof HTTPException){
    if(e.status === 404){
      return c.html("404<br><a href=\"/\">ホーム</a>", 404);
    }else return e.getResponse();
  }else{
    console.error(e);
    return c.json({
      code: "InternalServerError",
      message: "Internal server error occurred"
    })
  }
});

app.notFound(async c=>{
  const p = resolve(fs_base, c.req.path.substring(1));
  const f = file(p);
  if(p.startsWith(fs_base) && await f.exists())
    return new Response(f);
  else{
    const route = routesMap.find(e=>e[0].test(c.req.path));
    console.log(route)
    if(!route) throw new HTTPException(404);
    else return typeof route[1] === "string" ? c.redirect(route[1]) : new Response(route[1])
  }
});


export default app
