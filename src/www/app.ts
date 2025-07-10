import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { handleWWW } from "./www";

const app = new Elysia()
.use(swagger({ documentation: { info: { title: "WWW document", version: "0.0.0" } } }))
.use(cors({
  origin: "http://localhost:4517",
  allowedHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-type'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))
.onError(async({code, set, error, route, redirect})=>{
  switch(code){
    case "NOT_FOUND":
      const www = await handleWWW(route);
      if(www) return typeof www === "string" ?
        redirect(www) : www;

      set.status = 404;
      set.headers["content-type"] = "text/html";
      return "404<br><a href=\"/\">ホーム</a>";
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      set.status = 500;
      return {
        code: "InternalServerError",
        message: "Internal server error occurred"
      }
  }
});

export default app
