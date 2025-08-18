import { t } from "elysia";

import { ElysiaApp } from "../../../../utils/app";

export const siteAPIProjectsAllRoutes = (app: ElysiaApp) =>
  app.get(
    "/all/",
    ({ user }) => {
      if (!user) return Response.redirect("/");
      return new Response(null, { status: 501 });
    },
    {
      detail: { summary: "ログインしているユーザーのプロジェクト一覧を取得します" },
      query: t.Object({
        page: t.Optional(t.String({ pattern: "^\\d+$", description: "ページ番号" })),
        ascsort: t.Optional(
          t.Union(
            [
              t.Literal(""),
              t.Literal("view_count"),
              t.Literal("love_count"),
              t.Literal("remixers_count"),
              t.Literal("title"),
            ],
            {
              description: "昇順でソートする要素",
            }
          )
        ),
        descsort: t.Optional(
          t.Union(
            [
              t.Literal(""),
              t.Literal("view_count"),
              t.Literal("love_count"),
              t.Literal("remixers_count"),
              t.Literal("title"),
            ],
            { description: "降順でソートする要素" }
          )
        ),
      }),
      response: t.Array(
        t.Object({
          pk: t.Number({ description: "プロジェクトID" }),
          model: t.Literal("projects.project"),
          fields: t.Object({
            commenters_count: t.Number({ description: "コメント数" }),
            creator: t.Object({
              admin: t.Boolean({ description: "管理者かどうか" }),
              pk: t.Number({ description: "ユーザーID" }),
              thumbnail_url: t.String({ format: "uri", description: "ユーザーアイコン" }),
              username: t.String({ description: "ユーザー名" }),
            }),
            datetime_created: t.String({
              format: "date-time",
              description: "プロジェクト作成日時",
            }),
            datetime_modified: t.String({
              format: "date-time",
              description: "プロジェクト変更日時",
            }),
            datetime_shared: t.Nullable(
              t.String({ format: "date-time", description: "プロジェクト共有日時" })
            ),
            favorite_count: t.Number({ description: "お気に入り数" }),
            isPublished: t.Boolean({ description: "プロジェクトが共有されてるか" }),
            love_count: t.Number({ description: "好きの数" }),
            remixers_count: t.Number({ description: "リミックス数" }),
            thumbnail: t.String({ description: "サムネイル名" }),
            thumbnail_url: t.String({ format: "uri", description: "サムネイルURL" }),
            title: t.String({ description: "プロジェクトタイトル" }),
            uncached_thumbnail_url: t.String({
              format: "uri",
              description: "キャッシュされないサムネイルURL",
            }),
            view_count: t.Number({ description: "参照数" }),
            visibility: t.String({ description: "報告状態", examples: ["visible", "censbycomm"] }),
          }),
        })
      ),
    }
  );
