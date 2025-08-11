import { ElysiaApp } from "../../../utils/app";

import { checkPasswordRoutes } from "./checkpassword";
import { checkUsernameRoutes } from "./checkusername";

export const accountsRoutes = (app: ElysiaApp) =>
  app.group("/accounts", (app) => app.use(checkUsernameRoutes).use(checkPasswordRoutes));
