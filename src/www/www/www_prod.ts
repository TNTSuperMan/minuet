import { zstdDecompress } from "bun";

import { get_files } from "./www_files_4bundle" with { type: "macro" };

const files = await get_files();

const cache: {
  [key: string]: void | null | Blob;
} = {};

export default new Proxy<{
  [key: string]: Promise<void | Blob>;
}>(
  {},
  {
    async get(_, p: string) {
      if (p in cache) return cache[p] ?? undefined;
      else if (p in files)
        if (typeof files[p][1] === "string")
          return (cache[p] = new Blob([files[p][1]], { type: files[p][0] }))
        else
          return (cache[p] = new Blob([await zstdDecompress(Buffer.from(files[p][1][0], "base64"))], { type: files[p][0] }));
      else {
        cache[p] = null;
        return undefined;
      }
    },
    has(_, p: string) {
      return p in files;
    },
  }
);
