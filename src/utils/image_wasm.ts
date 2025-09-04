import { readFileSync } from "fs";

export const WASM = async () =>
  readFileSync(
    `${import.meta.dir}/../../node_modules/wasm-image-optimization/dist/esm/libImage.wasm`
  ).toBase64();
