import { readFileSync } from "fs";

export const default_icon_base64 = () => readFileSync(`${import.meta.dir}/default.png`).toBase64();
