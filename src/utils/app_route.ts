/* eslint-disable @typescript-eslint/no-explicit-any */

import Elysia, { AnyElysia, MergeSchema, UnwrapRoute } from "elysia";
import { JoinPath, Prettify } from "elysia/types";

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
