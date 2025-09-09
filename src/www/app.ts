import { createElysiaApp } from "../utils/app";

import { WWWPageRoutes } from "./www";

const app = createElysiaApp("WWW")
  .use(WWWPageRoutes)
  .onError(async ({ code, status, error }) => {
    switch (code) {
      case "NOT_FOUND":
        return '404<br><a href="/">ホーム</a>';
      case "INTERNAL_SERVER_ERROR":
        console.error(error);
        return status(500, {
          code: "InternalServerError",
          message: "Internal server error occurred",
        });
    }
  });

export default app;
