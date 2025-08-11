import { ElysiaApp } from "../../../utils/app";

import { useProjectPlugin } from "./project";

export const internalAPIRoutes = (app: ElysiaApp) =>
  app.group("/internalapi", (app) => app.use(useProjectPlugin));
