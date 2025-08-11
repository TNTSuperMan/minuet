import { UserElysiaApp } from "..";
import { ElysiaAppRoute } from "../../../../utils/app";

import { userProjectsVisibilityRoutes } from "./visibility";

export type UserProjectsElysiaApp = ElysiaAppRoute<"/projects/:id", UserElysiaApp>;

export const userProjectsRoutes = (app: UserElysiaApp) =>
  app.group("/projects/:id", (app) => app.use(userProjectsVisibilityRoutes));
