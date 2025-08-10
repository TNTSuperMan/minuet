import app from "../../app";
import { checkEmailRoutes } from "./check_email";
import { accountsLoginRoutes } from "./login";
import "./register_new_user";
import { accountsRegisterNewUserRoutes } from "./register_new_user";

app.group("/account", (app) =>
  app.use(checkEmailRoutes).use(accountsLoginRoutes).use(accountsRegisterNewUserRoutes)
);
