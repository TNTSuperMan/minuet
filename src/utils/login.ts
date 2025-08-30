import { password } from "bun";

import { DBUser, getUser } from "./user";

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
  const user = await getUser(name);
  if (!user) return { type: "notFound" };
  if (!(await password.verify(pass, user.password))) return { type: "invalidPass" };

  return {
    type: "success",
    info: user,
  };
};
