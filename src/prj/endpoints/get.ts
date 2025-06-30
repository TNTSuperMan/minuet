import { HTTPException } from "hono/http-exception";
import app from "../app";
import { z } from "@hono/zod-openapi";
import { getProject } from "../../utils/project";
import { verify } from "hono/jwt";
import { key } from "../../utils/secret";

const textDecoder = new TextDecoder;

app.openapi({
  path: "/{id}", method: "get",
  description: "プロジェクトのJSONを返します",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID"),
    }),
    query: z.object({
      token: z.string().describe("プロジェクトトークン")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.any().describe("プロジェクトデータ")
        }
      }
    }
  }
}, async c => {
  const { token } = c.req.valid("query");
  const id = parseInt(c.req.valid("param").id);

  const result = await verify(token, key.publicKey, "EdDSA").catch(()=>null);

  if(result === null || typeof result.id !== "number" || result.id !== id) throw new HTTPException(403);

  const proj = getProject(id);
  if(!proj) throw new HTTPException(403);

  return c.json(JSON.parse(
    typeof proj.json === "string" ?
    proj.json : textDecoder.decode(proj.json)))
})
