import { readdir, readFile, stat } from "fs/promises";
import { resolve } from "path";

import { file } from "bun";

export const get_files = async (): Promise<{ [key: string]: [string, string] }> =>
  Object.fromEntries(
    (
      await Promise.all(
        (await readdir("minuet-www/build", { recursive: true, encoding: "ascii" })).map(
          async (e): Promise<[string, [string, string]] | null> => {
            const path = resolve("minuet-www/build", e);
            const s = await stat(path);
            if (s.isDirectory()) return null;
            return [e, [file(path).type, (await readFile(path)).toBase64()]];
          }
        )
      )
    ).filter((e) => e !== null)
  );
