import app from "./app";

const createHostOrigin = (host: URL | string, port: string) => {
  const url = new URL("", host);
  url.port = port;
  return url.origin;
};

app.get("/env.js", ({ set }) => {
  set.headers["content-type"] = "text/javascript";
  const host = new URL(process.env.HOST || "http://localhost");

  return `window.process = ${JSON.stringify({
    env: {
      NODE_ENV: process.env.NODE_ENV || "production",
      API_HOST: createHostOrigin(host, process.env.API_PORT || "4519"),
      ROOT_URL: createHostOrigin(host, process.env.WWW_PORT || "4517"),
      TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
      ASSET_HOST: createHostOrigin(host, process.env.ASSET_PORT || "4518"),
      BACKPACK_HOST: `http://example.com`,
      CLOUDDATA_HOST: `http://example.com`,
      PROJECT_HOST: createHostOrigin(host, process.env.PROJECT_PORT || "4513"),
      STATIC_HOST: createHostOrigin(host, process.env.STATIC_PORT || "4514"),
      THUMBNAIL_URI: "/internalapi/project/thumbnail/{}/set/",
      THUMBNAIL_HOST: "",
      DEBUG: process.env.NODE_ENV !== "production",
      ONBOARDING_TEST_ACTIVE: "false",
      ONBOARDING_TEST_PROJECT_IDS: JSON.stringify({
        clicker: "1",
        pong: "1",
        animateCharacter: "1",
        makeItFly: "1",
        recordSound: "1",
        makeMusic: "1",
      }),
      ONBOARDING_TESTING_STARTING_DATE: "2024-01-20",
      ONBOARDING_TESTING_ENDING_DATE: "2030-11-20",
      QUALITATIVE_FEEDBACK_ACTIVE: "false",
      QUALITATIVE_FEEDBACK_STARTING_DATE: "2024-01-20",
      QUALITATIVE_FEEDBACK_ENDING_DATE: "2024-11-20",
      QUALITATIVE_FEEDBACK_IDEAS_GENERATOR_USER_FREQUENCY: "2",
      QUALITATIVE_FEEDBACK_STARTER_PROJECTS_USER_FREQUENCY: "2",
      QUALITATIVE_FEEDBACK_DEBUGGING_USER_FREQUENCY: "2",
      QUALITATIVE_FEEDBACK_TUTORIALS_USER_FREQUENCY: "2",
      IDEAS_GENERATOR_SOURCE: "https://example.com",
      MANUALLY_SAVE_THUMBNAILS: "true"

    },
  })}`;
});
