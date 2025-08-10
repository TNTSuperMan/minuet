import { ElysiaApp } from "../../../utils/app";
import { checkEmailRoutes } from "./check_email";
import { accountsLoginRoutes } from "./login";
import "./register_new_user";
import { accountsRegisterNewUserRoutes } from "./register_new_user";

export const accountsRoutes = (app: ElysiaApp) =>
  app.group("/accounts", (app) =>
    app.use(checkEmailRoutes).use(accountsLoginRoutes).use(accountsRegisterNewUserRoutes)
  );
