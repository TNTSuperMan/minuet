import app from "../../app";
import { z } from "@hono/zod-openapi";
import { projectDataSchema } from "./_util";

app.openapi(
  {
    path: "/projects/{id}/remixes",
    method: "get",
    description: "プロジェクトのリミックスリスト",
    request: {
      query: z.object({
        limit: z.string().regex(/^\d+$/).describe("表示上限"),
      }),
    },
    responses: {
      200: {
        description: "おｋ",
        content: {
          "application/json": {
            schema: z.array(projectDataSchema),
          },
        },
      },
    },
  },
  (c) => c.json([])
);
