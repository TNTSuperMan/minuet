import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("Uploads").onError(({ code, status, error }) => {
  switch (code) {
    case "NOT_FOUND":
      return status(404, "404 Not Found");
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      return status(500, "500 Internal Server Error");
  }
});

export default app;
