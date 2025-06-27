import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

//@ts-ignore
export const key = (await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])) as {
  publicKey: CryptoKey,
  privateKey: CryptoKey
};

export const genToken = (payload: JWTPayload, exp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return sign({
    ...payload,
    exp: now + exp,
    iat: now,
    nbf: now,
  }, key.privateKey, "EdDSA");
}
