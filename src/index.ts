import { serve } from "bun";
import app from "./api";

const apiServer = serve({
    fetch: app.fetch,
    port: 4519
});

console.log(`API server is running at ${apiServer.url.toString()}`);
