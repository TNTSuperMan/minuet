import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import Elysia, { InferContext } from "elysia";
import { key } from "./secret";
import cors from "@elysiajs/cors";
import { deriveSigninedUser } from "./user";

const version = "0.0.0";

export type ElysiaApp = ReturnType<typeof createElysiaApp>;

export type ElysiaContext = InferContext<ReturnType<typeof createElysiaAppWithoutDerives>>;

const createElysiaAppWithoutDerives = (name: string) =>
  new Elysia()
    .use(swagger({ documentation: { info: { title: name + " document", version } } }))
    .use(jwt({ name: "jwt", secret: key.privateKey }))
    .use(
      cors({
        origin: "http://localhost:4517",
        allowedHeaders: [
          "X-Custom-Header",
          "Upgrade-Insecure-Requests",
          "Content-type",
          "X-Token",
          "X-Csrftoken",
        ],
        methods: ["POST", "PUT", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
      })
    );

export const createElysiaApp = (name: string) =>
  createElysiaAppWithoutDerives(name).derive(deriveSigninedUser);
