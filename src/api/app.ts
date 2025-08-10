import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("API").onError(({ code, error, set, route }) => {
  switch (code) {
    case "NOT_FOUND":
      set.status = 404;
      return {
        code: "ResourceNotFound",
        message: `${route} does not exist`,
      };
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
