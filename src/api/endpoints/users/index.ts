import { z } from "@hono/zod-openapi"
import app from "../../app"
import { database } from "../../../utils/db"
import { HTTPException } from "hono/http-exception";

app.openapi({
    path: "/users/:usr/", method: "get",
    description: "ユーザー情報を返します",
    responses: {
        200: {
            description: "ユーザーは存在します",
            content: {
                "application/json": {
                    schema: z.object({
                        id: z.number().describe("ユーザーID"),
                        username: z.string().describe("ユーザー名"),
                        scratchteam: z.boolean().describe("scratchteamかどうか"),
                        history: z.object({
                            joined: z.string().datetime().describe("ユーザー登録日時"),
                        }),
                        profile: z.object({
                            id: z.number().describe("プロファイルID(よくわからん)"),
                            images: z.object({
                                "90x90": z.string().url(),
                                "60x60": z.string().url(),
                                "55x55": z.string().url(),
                                "50x50": z.string().url(),
                                "32x32": z.string().url(),
                            }).describe("アイコンURL"),
                            status: z.string().describe("ユーザーの「私が取り組んでいること」"),
                            bio: z.string().describe("ユーザーの「私について」"),
                            country: z.string().describe("ユーザーが住んでいる国")
                        })
                    })
                }
            }
        }
    }
}, c => {
    const usrid_low = c.req.param("usr")!;
    const id = database.users.findIndex(e=>e.username.toLowerCase() == usrid_low);
    if(id == -1) throw new HTTPException(404);
    const usrdata = database.users[id];
    return c.json({
        id,
        username: usrdata.username,
        scratchteam: usrdata.scratchteam,
        history: usrdata.history,
        profile: {
            id: usrdata.profile_id,
            images: usrdata.images,
            status: usrdata.status,
            bio: usrdata.bio,
            country: usrdata.country
        }
    })
})
