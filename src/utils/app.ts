import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { key } from "./secret";
import cors from "@elysiajs/cors";

const version = "0.0.0";

export const createElysiaApp = (name: string) => new Elysia()
  .use(swagger({ documentation: { info: { title: name + " document", version } } }))
  .use(jwt({ name: "jwt", secret: key.privateKey }))
  .use(cors({
    origin: "http://localhost:4517",
    allowedHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-type', 'X-Token', 'X-Csrftoken'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  }));
