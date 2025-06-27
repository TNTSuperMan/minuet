import { randomBytes } from "crypto";
import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const secret = randomBytes(256).toString("ascii");

export const genToken = (payload: JWTPayload, exp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return sign({
    ...payload,
    exp: now + exp,
    iat: now,
    nbf: now,
  }, secret, "EdDSA");
}
