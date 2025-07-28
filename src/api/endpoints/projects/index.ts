import { ElysiaApp } from "../../../utils/app";
import { getProjectPlugin } from "./get";
import { putProjectPlugin } from "./put";
import { projectsRemixesPlugin } from "./remixes";

export const projectsPlugin = (app: ElysiaApp) =>
  app.group("/projects", (app) =>
    app.use(getProjectPlugin).use(putProjectPlugin).use(projectsRemixesPlugin)
  );
