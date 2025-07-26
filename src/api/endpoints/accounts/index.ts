import app from "../../app";
import { checkPasswordPlugin } from "./checkpassword";
import { checkUsernamePlugin } from "./checkusername";

app.group("/accounts", (app) => app.use(checkUsernamePlugin).use(checkPasswordPlugin));
