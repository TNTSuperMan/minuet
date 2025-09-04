import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("Uploads").onError(({ code, set, error }) => {
  switch (code) {
    case "NOT_FOUND":
      set.status = 404;
      return "404 Not Found";
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      set.status = 500;
      return "500 Internal Server Error";
  }
});

export default app;
