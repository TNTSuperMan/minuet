import app from "../../app";
import { database } from "../../../utils/db";
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
}, c => c.json(newsSchema.parse(database.query("SELECT * FROM news").all())));
