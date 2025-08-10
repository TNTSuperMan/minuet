import { password, randomUUIDv7 } from "bun";
import { createExpire } from "./secret";
import { DBUser, getUser } from "./user";
import { ElysiaContext } from "./app";

export const login = async (
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
      info: DBUser;
    }
> => {
  const user = getUser(name);
  if (!user) return { type: "notFound" };
  if (!(await password.verify(pass, user.password))) return { type: "invalidPass" };

  return {
    type: "success",
    info: user,
  };
};
