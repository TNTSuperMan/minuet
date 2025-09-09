import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("Projects API").onError(({ code, status, error }) => {
  switch (code) {
    case "NOT_FOUND":
      return status(404, "404 Not Found");
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      return status(500, {
        code: "InternalServerError",
        message: "Internal server error occurred",
      });
  }
});

export default app;
