import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

const app = new OpenAPIHono;

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

export default app
