import { ElysiaApp } from "../../../../utils/app";
import { useThumbnailPlugin } from "./thumbnail";

export const useProjectPlugin = (app: ElysiaApp) =>
  app.group("/project", app =>
    app.use(useThumbnailPlugin));
