import { z } from "@hono/zod-openapi";
import { file, write } from "bun";
import { resolve } from "path";
import { newsSchema } from "../api/news/types";

export const dbSchema = z.object({
    news: newsSchema
});

let dbCache: z.infer<typeof dbSchema> = {
    news: []
};
const dbFile = file(resolve(__dirname, "db.json"));
try{
    dbCache = dbSchema.parse(await dbFile.json());
}catch{ }

let doWrite = false;

setInterval(() => {
    if(doWrite){
        doWrite = false;
        write(dbFile, JSON.stringify(dbCache));
    }
}, 1000);

export const database = new Proxy(dbCache, {
    set(t,p,v,r){
        doWrite = true;
        return Reflect.set(t,p,v,r);
    }
});
