import { HTTPException } from "hono/http-exception";
import { database } from "../../../utils/db";
import { DBProjectSchema } from "../../../utils/project";
import { DBUserSchema, getImages, getSigninedUser, imagesSchema } from "../../../utils/user";
import app from "../../app";
import { z } from "@hono/zod-openapi";
import { genToken } from "../../../utils/secret";

app.openapi({
  path: "/projects/:id", method: "get",
  description: "プロジェクトのメタデータを返します",
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).describe("プロジェクトID")
    })
  },
  responses: {
    200: {
      description: "おｋ",
      content: {
        "application/json": {
          schema: z.object({
            author: z.object({
              history: z.object({
                joined: z.string().datetime().describe("ユーザーの参加日")
              }),
              id: z.number().describe("ユーザーID"),
              profile: z.object({
                id: z.number().nullable().describe("プロファイルID(?)"),
                images: imagesSchema
              }),
              scratchteam: z.boolean().describe("Scratchチームかどうか"),
              username: z.string().describe("ユーザー名")
            }),
            comments_allowed: z.boolean().describe("コメントが許可されているか"),
            description: z.string().describe("メモとクレジット"),
            history: z.object({
              created: z.string().datetime().describe("作成日時"),
              modified: z.string().datetime().describe("編集日時"),
              shared: z.string().datetime().nullable().describe("共有日時"),
            }),
            id: z.number().describe("プロジェクトID"),
            image: z.string().url().describe("サムネイルURL"),
            images: z.object({
              "100x80": z.string().url(),
              "135x102": z.string().url(),
              "144x108": z.string().url(),
              "200x200": z.string().url(),
              "216x163": z.string().url(),
              "282x218": z.string().url(),
            }).describe("サイズごとのサムネイル"),
            instructions: z.string().describe("使い方"),
            is_published: z.boolean().describe("プロジェクトが公開されているか"),
            project_token: z.string().describe("プロジェクトのアクセストークン"),
            public: z.boolean().describe("プロジェクトが公開されているか"),
            remix: z.object({
              parent: z.number().nullable().describe("リミックス元のID"),
              root: z.number().nullable().describe("リミックスの大本のID"),
            }),
            stats: z.object({
              views: z.number().describe("参照数"),
              loves: z.number().describe("好き数"),
              favorites: z.number().describe("お気に入り数"),
              remixes: z.number().describe("リミックス数")
            }),
            title: z.string().describe("タイトル"),
            visibility: z.string().describe("可視かどうか(visibleだけか?)")
          })
        }
      }
    }
  }
}, async c => {
  const proj_ = database.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).all(parseInt(c.req.valid("param").id));
  if(!proj_.length) throw new HTTPException(404);

  const proj = DBProjectSchema.parse(proj_[0]);

  if(proj.public === 0){
    const user = await getSigninedUser(c);
    if(!user || proj.author !== user.id) throw new HTTPException(404);
  }

  const author = DBUserSchema.parse(database.prepare("SELECT * FROM users WHERE id = ?").all(proj.author)[0]);

  return c.json({
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
      username: author.name
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
    project_token: await genToken({
      id: proj.id,
    }, 60 * 5),
    public: proj.public != 0,
    remix: {
      parent: proj.parent,
      root: proj.parent, // TODO: ここを修正して
    },
    stats: { // TODO: そういう機能ができたら実装
      views: 1,
      loves: 0,
      favorites: 0,
      remixes: 0,
    },
    title: proj.title,
    visibility: "visible"
  })
})
