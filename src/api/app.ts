import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

const app = new OpenAPIHono();

app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    title: "API document",
    version: "1.0.0"
  }
}).get("/docs", swaggerUI({
  url: "/spec"
})).onError((e,c)=>{
  if(e instanceof HTTPException){
    if(e.status === 404){
      return c.json({
        code: "ResourceNotFound",
        message: `${c.req.url} does not exist`
      }, 404)
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

export default app
