import app from "../api";

const createHostOrigin = (host: URL | string, port: string) => {
    const url = new URL("", host);
    url.port = port;
    return url.origin;
}

app.get("/env.js", ({ set }) => {
    set.headers["content-type"] = "text/javascript";
    const host = new URL(process.env.HOST || 'http://localhost');
    
    return `window.process = ${JSON.stringify({
        env: {
            NODE_ENV: process.env.NODE_ENV || 'production',
            API_HOST: createHostOrigin(host, process.env.API_PORT || '4519'),
            ROOT_URL: createHostOrigin(host, process.env.WWW_PORT || '4517'),
            ASSET_HOST: createHostOrigin(host, process.env.ASSET_PORT || '4518'),
            PROJECT_HOST: createHostOrigin(host, process.env.PROJECT_PORT || '4513'),
        }
    })}`;
})
