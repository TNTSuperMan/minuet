//@ts-ignore
export const key = (await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])) as {
  publicKey: CryptoKey,
  privateKey: CryptoKey
};

export const createExpire = (exp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    exp: now + exp,
    iat: now,
    nbf: now,
  };
}
