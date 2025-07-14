import app from "../../app";
import { useCheckEmailPlugin } from "./check_email";
import "./login";
import "./register_new_user";

app.group("/account", app => app
  .use(useCheckEmailPlugin));
