import { z } from "@hono/zod-openapi";
import { file, write } from "bun";
import { resolve } from "path";
import { newsSchema } from "../api/endpoints/news/types";

export const dbSchema = z.object({
  news: newsSchema,
  users: z.array(z.object({
    username: z.string(),
    scratchteam: z.boolean(),
    history: z.object({
      joined: z.string().datetime(),
    }),
    profile_id: z.number(),
    images: z.object({
      "90x90": z.string().url(),
      "60x60": z.string().url(),
      "55x55": z.string().url(),
      "50x50": z.string().url(),
      "32x32": z.string().url(),
    }),
    status: z.string(),
    bio: z.string(),
    country: z.string(),
  })),
});

let dbCache: z.infer<typeof dbSchema> = {
  news: [],
  users: [],
};
const dbFile = file(resolve(__dirname, "db.json"));
try{
  dbCache = dbSchema.parse(await dbFile.json());
}catch(cause){
  if(await dbFile.exists()) throw new Error("Failed to load database", { cause });
  else write(dbFile, JSON.stringify(dbCache))
}

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
