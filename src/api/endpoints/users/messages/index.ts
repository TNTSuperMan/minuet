import { UserElysiaApp } from "..";
import { ElysiaAppRoute } from "../../../../utils/app";
import { userMessagesCountRoutes } from "./count";

export type UserMessagesRoutes = ElysiaAppRoute<"/messages", UserElysiaApp>;

export const userMessagesRoutes = (app: UserElysiaApp) =>
  app.group("/messages", (app) => app.use(userMessagesCountRoutes));
