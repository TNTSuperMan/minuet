import app from "../../app";
import { useProjectPlugin } from "./project";

app.group("/internalapi", app =>
  app.use(useProjectPlugin));
