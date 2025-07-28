import { ElysiaApp } from "../../../../utils/app";
import { proxyShareProjectPlugin } from "./share";

export const proxyProjectsPlugin = (app: ElysiaApp) =>
  app.group("/projects", (app) => app.use(proxyShareProjectPlugin));
