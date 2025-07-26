import { handleWWW } from "./www";
import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("WWW").onError(async ({ code, set, error, route, redirect }) => {
  switch (code) {
    case "NOT_FOUND":
      const www = await handleWWW(route);
      if (www) return typeof www === "string" ? redirect(www) : www;

      set.status = 404;
      set.headers["content-type"] = "text/html";
      return '404<br><a href="/">ホーム</a>';
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      set.status = 500;
      return {
        code: "InternalServerError",
        message: "Internal server error occurred",
      };
  }
});

export default app;
