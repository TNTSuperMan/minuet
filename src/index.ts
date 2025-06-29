import { serve } from "bun";
import apiApp from "./api";
import webApp from "./www";
import resApp from "./res";

const apiServer = serve({
  fetch: apiApp.fetch,
  port: 4519
});
const wwwServer = serve({
  fetch: webApp.fetch,
  port: 4517
});
const resServer = serve({
  fetch: resApp.fetch,
  port: 4514
})

console.log(`API server is running at ${apiServer.url.toString()}`);
console.log(`Web server is running at ${wwwServer.url.toString()}`);
console.log(`Res server is running at ${resServer.url.toString()}`);
