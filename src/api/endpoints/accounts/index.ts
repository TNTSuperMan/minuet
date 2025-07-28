import { ElysiaApp } from "../../../utils/app";
import app from "../../app";
import { checkPasswordPlugin } from "./checkpassword";
import { checkUsernamePlugin } from "./checkusername";

export const accountsPlugin = (app: ElysiaApp) =>
  app.group("/accounts", (app) => app.use(checkUsernamePlugin).use(checkPasswordPlugin));
