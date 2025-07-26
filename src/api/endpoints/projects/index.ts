import app from "../../app";
import { getProjectPlugin } from "./get";
import { putProjectPlugin } from "./put";
import { projectsRemixesPlugin } from "./remixes";

app.group("/projects", (app) =>
  app.use(getProjectPlugin).use(putProjectPlugin).use(projectsRemixesPlugin)
);
