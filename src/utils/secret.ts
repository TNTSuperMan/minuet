import { webcrypto } from "crypto";

import { file } from "bun";

const key_config = [
  { name: "HMAC", hash: "SHA-256" } as webcrypto.HmacKeyGenParams,
  true,
  ["sign", "verify"] as ["sign", "verify"],
] as const;

const getKey = async (): Promise<webcrypto.CryptoKey> => {
  if (process.env.JWT_KEY_PATH) {
    const jwt_key_file = file(process.env.JWT_KEY_PATH);
    if (await jwt_key_file.exists()) {
      return await crypto.subtle.importKey("raw", await jwt_key_file.bytes(), ...key_config);
    } else {
      const key = await crypto.subtle.generateKey(...key_config);
      await jwt_key_file.write(await crypto.subtle.exportKey("raw", key));
      return key;
    }
  } else {
    return await crypto.subtle.generateKey(...key_config);
  }
};

export const key = await getKey();

export const createExpire = (exp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    exp: now + exp,
    iat: now,
    nbf: now,
  };
};
