import { ElysiaApp, ElysiaAppRoute } from "../../../utils/app";
import { getImages, getUser, userSchema } from "../../../utils/user";
import { NotFoundError, t } from "elysia";

export type UserElysiaApp = ElysiaAppRoute<"/users/:usr", ElysiaApp>;

export const userRoutes = (app: ElysiaApp) =>
  app.group("/users/:usr", (app) =>
    app.get(
      "/",
      ({ params: { usr } }) => {
        const user = getUser(usr);
        if (!user) throw new NotFoundError();
        else
          return {
            id: user.id,
            username: user.name,
            scratchteam: user.scratchteam != 0,
            history: {
              joined: new Date(user.joined).toISOString(),
            },
            profile: {
              id: user.id,
              images: getImages(user.id),
              status: user.status,
              bio: user.bio,
              country: user.country,
            },
          };
      },
      {
        detail: { summary: "ユーザー情報を返します" },
        params: t.Object({
          usr: t.String({ description: "ユーザー名" }),
        }),
        response: userSchema,
      }
    )
  );
