import { t } from "elysia";
import { DBUser, getImages, imagesSchema } from "../../../utils/user";
import { DBProject } from "../../../utils/project";

export const projectDataSchema = t.Object({
  author: t.Object({
    history: t.Object({
      joined: t.String({ format: "date-time", description: "ユーザーの参加日" }),
    }),
    id: t.Number({ description: "ユーザーID" }),
    profile: t.Object({
      id: t.Nullable(t.Number({ description: "プロファイルID(?)" })),
      images: imagesSchema,
    }),
    scratchteam: t.Boolean({ description: "Scratchチームかどうか" }),
    username: t.String({ description: "ユーザー名" }),
  }),
  comments_allowed: t.Boolean({ description: "コメントが許可されているか" }),
  description: t.String({ description: "メモとクレジット" }),
  history: t.Object({
    created: t.String({ format: "date-time", description: "作成日時" }),
    modified: t.String({ format: "date-time", description: "編集日時" }),
    shared: t.Nullable(t.String({ format: "date-time", description: "共有日時" })),
  }),
  id: t.Number({ description: "プロジェクトID" }),
  image: t.String({ format: "uri", description: "サムネイルURL" }),
  images: t.Object(
    {
      "100x80": t.String({ format: "uri" }),
      "135x102": t.String({ format: "uri" }),
      "144x108": t.String({ format: "uri" }),
      "200x200": t.String({ format: "uri" }),
      "216x163": t.String({ format: "uri" }),
      "282x218": t.String({ format: "uri" }),
    },
    { description: "サイズごとのサムネイル" }
  ),
  instructions: t.String({ description: "使い方" }),
  is_published: t.Boolean({ description: "プロジェクトが公開されているか" }),
  project_token: t.String({ description: "プロジェクトのアクセストークン" }),
  public: t.Boolean({ description: "プロジェクトが公開されているか" }),
  remix: t.Object({
    parent: t.Nullable(t.Number({ description: "リミックス元のID" })),
    root: t.Nullable(t.Number({ description: "リミックスの大本のID" })),
  }),
  stats: t.Object({
    views: t.Number({ description: "参照数" }),
    loves: t.Number({ description: "好き数" }),
    favorites: t.Number({ description: "お気に入り数" }),
    remixes: t.Number({ description: "リミックス数" }),
  }),
  title: t.String({ description: "タイトル" }),
  visibility: t.String({ description: "可視かどうか(visibleだけか?)" }),
});

export const getProjectData = (
  proj: DBProject,
  author: DBUser,
  token: string
): typeof projectDataSchema.static => ({
  author: {
    history: {
      joined: new Date(author.joined).toISOString(),
    },
    id: author.id,
    profile: {
      id: null,
      images: getImages(author.id),
    },
    scratchteam: author.scratchteam !== 0,
    username: author.name,
  },
  comments_allowed: proj.comments_allowed !== 0,
  description: proj.description,
  history: {
    created: new Date(proj.created).toISOString(),
    modified: new Date(proj.modified).toISOString(),
    shared: proj.shared === null ? null : new Date(proj.shared).toISOString(),
  },
  id: proj.id,
  image: "https://example.com/comming_soon",
  images: {
    "100x80": "https://example.com/comming_soon",
    "135x102": "https://example.com/comming_soon",
    "144x108": "https://example.com/comming_soon",
    "200x200": "https://example.com/comming_soon",
    "216x163": "https://example.com/comming_soon",
    "282x218": "https://example.com/comming_soon",
  },
  instructions: proj.instructions,
  is_published: proj.public != 0,
  project_token: token,
  public: proj.public != 0,
  remix: {
    parent: proj.parent,
    root: proj.parent, // TODO: ここを修正して
  },
  stats: {
    // TODO: そういう機能ができたら実装
    views: 1,
    loves: 0,
    favorites: 0,
    remixes: 0,
  },
  title: proj.title,
  visibility: "visible",
});
