import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

const app = new Elysia()
.use(swagger({ documentation: { info: { title: "Project API document", version: "0.0.0" } } }))
.use(cors({
  origin: "http://localhost:4517",
  allowedHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-type'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))
.onError(({code, set, error})=>{
  switch(code){
    case "NOT_FOUND":
      set.status = 404;
      return "404 Not Found";
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
