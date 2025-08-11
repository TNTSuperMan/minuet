import { ElysiaApp } from "../../../utils/app";

import { proxyFeaturedRoutes } from "./featured";
import { proxyProjectsRoutes } from "./projects";

export const proxyRoutes = (app: ElysiaApp) =>
  app.group("/proxy", (app) => app.use(proxyFeaturedRoutes).use(proxyProjectsRoutes));
