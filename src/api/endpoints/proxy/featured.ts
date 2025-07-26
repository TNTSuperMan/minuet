import app from "../../app";
import { z } from "@hono/zod-openapi";

const project = {
  creator: z.string().describe("プロジェクトの作者名"),
  id: z.number().describe("プロジェクトのID"),
  thumbnail_url: z.string().url().describe("プロジェクトのサムネイルURL"),
  title: z.string().describe("プロジェクトタイトル"),
  love_count: z.number().describe("ハート数"),
  type: z.string().describe('"project"という文字列'),
} as const;

app.openapi(
  {
    path: "/proxy/featured",
    method: "get",
    description: "ホームに出るプロジェクトとかの情報を返します",
    responses: {
      200: {
        description: "おｋ",
        content: {
          "application/json": {
            schema: z.object({
              community_featured_projects: z.array(z.object(project)),
              community_featured_studios: z.array(
                z.object({
                  id: z.number().describe("スタジオID"),
                  thumbnail_url: z.string().url().describe("スタジオのサムネイルURL"),
                  title: z.string().describe("スタジオのタイトル"),
                  type: z.string().describe('"gallery"という文字列'),
                })
              ),
              community_most_loved_projects: z.array(z.object(project)),
              community_most_remixed_projects: z.array(
                z.object({
                  ...project,
                  remixers_count: z.number().describe("リミックス数"),
                })
              ),
              community_newest_projects: z.array(z.object(project)),
              curator_top_projects: z.array(z.object(project)),
              scratch_design_studio: z.array(
                z.object({
                  creator: z.string().describe("作者"),
                  gallery_id: z.number().describe("スタジオID"),
                  gallery_title: z.string().describe("スタジオのタイトル"),
                  id: z.number().describe("プロジェクトID"),
                  love_count: z.number().describe("ハート数"),
                  thumbnail_url: z.string().url().describe("サムネイルURL"),
                  title: z.string().describe("プロジェクトのタイトル"),
                  type: z.string().describe('"project"という文字列'),
                })
              ),
            }),
          },
        },
      },
    },
  },
  async (c) => {
    // TODO: ちゃんとした実装にする
    return c.json({
      community_featured_projects: [],
      community_featured_studios: [],
      community_most_loved_projects: [],
      community_most_remixed_projects: [],
      community_newest_projects: [],
      curator_top_projects: [],
      scratch_design_studio: [],
    });
  }
);
