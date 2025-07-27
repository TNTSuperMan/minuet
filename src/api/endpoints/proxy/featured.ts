import { t } from "elysia";
import { ElysiaApp } from "../../../utils/app";

const project = t.Object({
  creator: t.String({ description: "プロジェクトの作者名" }),
  id: t.Number({ description: "プロジェクトのID" }),
  thumbnail_url: t.String({ format: "uri", description: "プロジェクトのサムネイルURL" }),
  title: t.String({ description: "プロジェクトタイトル" }),
  love_count: t.Number({ description: "ハート数" }),
  type: t.String({ description: '"project"という文字列' }),
});

const featuredResponse = t.Object({
  community_featured_projects: t.Array(project),
  community_featured_studios: t.Array(
    t.Object({
      id: t.Number({ description: "スタジオID" }),
      thumbnail_url: t.String({ format: "uri", description: "スタジオのサムネイルURL" }),
      title: t.String({ description: "スタジオのタイトル" }),
      type: t.String({ description: '"gallery"という文字列' }),
    })
  ),
  community_most_loved_projects: t.Array(project),
  community_most_remixed_projects: t.Array(
    t.Intersect([
      project,
      t.Object({
        remixers_count: t.Number({ description: "リミックス数" }),
      }),
    ])
  ),
  community_newest_projects: t.Array(project),
  curator_top_projects: t.Array(project),
  scratch_design_studio: t.Array(
    t.Object({
      creator: t.String({ description: "作者" }),
      gallery_id: t.Number({ description: "スタジオID" }),
      gallery_title: t.String({ description: "スタジオのタイトル" }),
      id: t.Number({ description: "プロジェクトID" }),
      love_count: t.Number({ description: "ハート数" }),
      thumbnail_url: t.String({ format: "uri", description: "サムネイルURL" }),
      title: t.String({ description: "プロジェクトのタイトル" }),
      type: t.String({ description: '"project"という文字列' }),
    })
  ),
});

export const proxyFeaturedPlugin = (app: ElysiaApp) =>
  app.get(
    "/proxy/featured",
    async () => {
      return {
        community_featured_projects: [],
        community_featured_studios: [],
        community_most_loved_projects: [],
        community_most_remixed_projects: [],
        community_newest_projects: [],
        curator_top_projects: [],
        scratch_design_studio: [],
      };
    },
    {
      detail: { summary: "ホームに出るプロジェクトとかの情報を返します" },
      response: featuredResponse,
    }
  );
