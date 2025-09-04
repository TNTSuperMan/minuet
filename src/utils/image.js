import LibImage from "../../node_modules/wasm-image-optimization/dist/esm/libImage.js";
import { WASM } from "./image_wasm" with { type: "macro" };
import {
  _optimizeImage,
  _optimizeImageExt,
} from "../../node_modules/wasm-image-optimization/dist/lib/optimizeImage.js";

const libImage = LibImage({
  wasmBinary: Buffer.from(WASM(), "base64").buffer,
});
export const optimizeImage = (params) => _optimizeImage({ ...params, libImage: libImage });
export const optimizeImageExt = (params) => _optimizeImageExt({ ...params, libImage: libImage });
