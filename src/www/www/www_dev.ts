import { existsSync, statSync } from "fs";
import { resolve } from "path";

import { file } from "bun";

const cache: {
  [key: string]: void | null | Blob;
} = {};

export default new Proxy<{
  [key: string]: Promise<void | Blob>;
}>(
  {},
  {
    async get(_, p: string) {
      const path = resolve("scratch-www", "build", p);
      if (p in cache) return cache[p] ?? undefined;
      const f = file(path);
      if (await f.exists()) {
        return (cache[p] = f);
      } else {
        cache[p] = null;
        return undefined;
      }
    },
    has(_, p: string) {
      const path = resolve("scratch-www", "build", p);
      return (p in cache && cache[p] !== null) || (existsSync(path) && statSync(path).isFile());
    },
  }
);
