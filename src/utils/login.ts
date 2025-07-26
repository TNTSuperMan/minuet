import { password, randomUUIDv7 } from "bun";
import { createExpire } from "./secret";
import { DBUserSchema, getUser } from "./user";
import { ElysiaContext } from "./app";

export const login = async (
  { cookie, jwt }: ElysiaContext,
  name: string,
  pass: string
): Promise<
  | {
      type: "notFound";
    }
  | {
      type: "invalidPass";
    }
  | {
      type: "success";
      token: string;
      info: typeof DBUserSchema.static;
    }
> => {
  const user = getUser(name);
  if (!user) return { type: "notFound" };
  if (!(await password.verify(pass, user.password))) return { type: "invalidPass" };

  const token = await jwt.sign({
    jti: randomUUIDv7(),
    aud: user.name,
    ...createExpire(14 * 24 * 60 * 60),
  });

  cookie["scratchsessionid"].value = token;

  return {
    type: "success",
    token,
    info: user,
  };
};
