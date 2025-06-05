import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    title: "API document",
    version: "1.0.0"
  }
}).get("/docs", swaggerUI({
  url: "/spec"
}));

export default app
