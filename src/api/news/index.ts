import app from "../../app";
import { z } from "@hono/zod-openapi";
import { database } from "../../utils/db";
import { newsSchema } from "./types";

app.openapi({
    path: "/news", method: "get",
    description: "ニュースを返します",
    responses: {
        200: {
            description: "おｋ",
            content: {
                "application/json": {
                    schema: newsSchema
                }
            }
        }
    }
}, c => c.json(database.news));
