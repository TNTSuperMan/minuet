import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("API").onError(({ code, error, status, route }) => {
  switch (code) {
    case "NOT_FOUND":
      return status(404, {
        code: "ResourceNotFound",
        message: `${route} does not exist`,
      });
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      return status(500, {
        code: "InternalServerError",
        message: "Internal server error occurred",
      });
  }
});

export default app;
