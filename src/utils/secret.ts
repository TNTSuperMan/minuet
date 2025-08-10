export const key = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);

export const createExpire = (exp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    exp: now + exp,
    iat: now,
    nbf: now,
  };
};
