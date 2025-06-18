import { randomBytes } from "crypto";

export const secret = randomBytes(256).toString("ascii");
