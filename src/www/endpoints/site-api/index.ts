import { ElysiaApp } from "../../../utils/app";

import { siteAPIProjectsRoutes } from "./projects";

export const siteAPIRoutes = (app: ElysiaApp) =>
  app.group("/site-api", (app) => app.use(siteAPIProjectsRoutes));
