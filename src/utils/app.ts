import jwt from "@elysiajs/jwt";
import swagger from "@elysiajs/swagger";
import Elysia, { AnyElysia, InferContext, MergeSchema, UnwrapRoute } from "elysia";
import { key } from "./secret";
import cors from "@elysiajs/cors";
import { deriveSigninedUser } from "./user";
import { JoinPath, Prettify } from "elysia/types";

const version = "0.0.0";

export type ElysiaApp = ReturnType<typeof createElysiaApp>;

type PrefixOf<E extends AnyElysia> =
  E extends Elysia<infer P, any, any, any, any, any, any> ? P : never;
type DefinitionsOf<E extends AnyElysia> =
  E extends Elysia<any, any, infer P, any, any, any, any> ? P : never;
type MetadataOf<E extends AnyElysia> =
  E extends Elysia<any, any, any, infer P, any, any, any> ? P : never;
export type ElysiaAppRoute<Prefix extends string, Base extends AnyElysia> = Elysia<
  JoinPath<PrefixOf<Base>, Prefix>,
  Base extends Elysia<any, infer P, any, any, any, any, any> ? P : never,
  DefinitionsOf<Base>,
  {
    schema: MergeSchema<
      UnwrapRoute<{}, DefinitionsOf<Base>["typebox"], JoinPath<PrefixOf<Base>, Prefix>>,
      MetadataOf<Base>["schema"]
    >;
    standaloneSchema: Prettify<
      UnwrapRoute<{}, DefinitionsOf<Base>["typebox"], JoinPath<PrefixOf<Base>, Prefix>> &
        MetadataOf<Base>["standaloneSchema"]
    >;
    macro: MetadataOf<Base>["macro"];
    macroFn: MetadataOf<Base>["macroFn"];
    parser: MetadataOf<Base>["parser"];
  },
  {},
  Base extends Elysia<any, any, any, any, any, infer P, any> ? P : never,
  Base extends Elysia<any, any, any, any, any, any, infer P> ? P : never
>;

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
