import { relative } from "path";

import { file, Glob, zstdCompressSync } from "bun";

export const get_files = async (): Promise<{ [key: string]: [string, string] }> =>
  Object.fromEntries(
    (
      await Promise.all(
        (await Array.fromAsync(new Glob("minuet-www/build/**").scan("."))).map(
          async (path): Promise<[string, [string, string]] | null> => {
            const name = relative("minuet-www/build", path);
            const f = file(path);
            const buf = await f.bytes().catch(() => null);
            if (buf === null) return null;
            // TODO: Bun.zstdCompressが安定したらそれに変える
            return [name, [f.type, zstdCompressSync(buf, { level: 22 }).toBase64()]];
          }
        )
      )
    ).filter((e) => e !== null)
  );
