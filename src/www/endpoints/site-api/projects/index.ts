import { ElysiaApp } from "../../../../utils/app";

import { siteAPIProjectsAllRoutes } from "./all";

export const siteAPIProjectsRoutes = (app: ElysiaApp) =>
  app.group("/projects", (app) => app.use(siteAPIProjectsAllRoutes));
