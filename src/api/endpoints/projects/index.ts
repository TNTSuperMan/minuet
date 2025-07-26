import app from "../../app";
import { getProjectPlugin } from "./get";
import { putProjectPlugin } from "./put";
import "./remixes";

app.group("/projects", app => app
  .use(getProjectPlugin)
  .use(putProjectPlugin));
