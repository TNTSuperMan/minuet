import app from "../app";

import { accountsRoutes } from "./accounts";
import { csrfTokenRoutes } from "./csrf_token";
import { internalAPIRoutes } from "./internalapi";
import { sessionRoutes } from "./session";

app.use(accountsRoutes).use(internalAPIRoutes).use(csrfTokenRoutes).use(sessionRoutes);
