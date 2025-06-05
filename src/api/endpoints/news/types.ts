import { z } from "@hono/zod-openapi";

export const newsSchema = z.array(z.object({
    id: z.number().describe("良く分かんないけどID"),
    stamp: z.string().datetime(),
    headline: z.string().describe("タイトル"),
    url: z.string().describe("ニュースのURL"),
    image: z.string().url().describe("ニュースの説明画像"),
    copy: z.string().describe("ニュースの説明"),
}));
