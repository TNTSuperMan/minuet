import app from "../app";

import { accountsRoutes } from "./accounts";
import { csrfTokenRoutes } from "./csrf_token";
import { internalAPIRoutes } from "./internalapi";
import { sessionRoutes } from "./session";
import { siteAPIRoutes } from "./site-api";

app
  .use(accountsRoutes)
  .use(internalAPIRoutes)
  .use(csrfTokenRoutes)
  .use(sessionRoutes)
  .use(siteAPIRoutes);
