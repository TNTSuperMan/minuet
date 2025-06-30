import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

const app = new OpenAPIHono;

app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    title: "Project API document",
    version: "1.0.0"
  }
}).get("/docs", swaggerUI({
  url: "/spec"
})).onError((e,c)=>{
  if(e instanceof HTTPException){
    if(e.status === 404){
      return c.text("404", 404);
    }else return e.getResponse();
  }else{
    console.error(e);
    return c.json({
      code: "InternalServerError",
      message: "Internal server error occurred"
    })
  }
}).notFound(()=>{
  throw new HTTPException(404);
});
app.use(cors({
  origin: "http://localhost:4517",
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-type'],
  allowMethods: ['POST', 'PUT', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

export default app
