import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("WWW").onError(async ({ code, status, error, set }) => {
  switch (code) {
    case "NOT_FOUND":
      set.headers["content-type"] = "text/html";
      return `<meta charset="utf-8">404<br><a href="/">ホーム</a>`;
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      return status(500, {
        code: "InternalServerError",
        message: "Internal server error occurred",
      });
  }
});

export default app;
