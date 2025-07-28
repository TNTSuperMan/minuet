import { ElysiaApp } from "../../../utils/app";
import { proxyFeaturedPlugin } from "./featured";
import { proxyProjectsPlugin } from "./projects";

export const proxyPlugin = (app: ElysiaApp) =>
  app.group("/proxy", (app) => app.use(proxyFeaturedPlugin).use(proxyProjectsPlugin));
