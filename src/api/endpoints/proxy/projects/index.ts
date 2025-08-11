import { ElysiaApp } from "../../../../utils/app";

import { proxyShareProjectRoutes } from "./share";

export const proxyProjectsRoutes = (app: ElysiaApp) =>
  app.group("/projects", (app) => app.use(proxyShareProjectRoutes));
