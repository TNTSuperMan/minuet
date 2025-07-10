import { createElysiaApp } from "../utils/app";

const app = createElysiaApp("Project API")
.onError(({code, set, error})=>{
  switch(code){
    case "NOT_FOUND":
      set.status = 404;
      return "404 Not Found";
    case "INTERNAL_SERVER_ERROR":
      console.error(error);
      set.status = 500;
      return {
        code: "InternalServerError",
        message: "Internal server error occurred"
      }
  }
});

export default app
