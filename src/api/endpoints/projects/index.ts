import { ElysiaApp } from "../../../utils/app";

import { getProjectRoutes } from "./get";
import { putProjectRoutes } from "./put";
import { projectsRemixesRoutes } from "./remixes";

export const projectsRoutes = (app: ElysiaApp) =>
  app.group("/projects", (app) =>
    app.use(getProjectRoutes).use(putProjectRoutes).use(projectsRemixesRoutes)
  );
