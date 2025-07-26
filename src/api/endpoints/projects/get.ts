import { NotFoundError, t } from "elysia";
import { ElysiaApp } from "../../../utils/app";
import { getProject } from "../../../utils/project";
import { getProjectData, projectDataSchema } from "./_util";
import { getUserWithID } from "../../../utils/user";
import { createExpire } from "../../../utils/secret";

export const getProjectPlugin = (app: ElysiaApp) =>
app.get("/:id", async ({ params: { id }, user, jwt }) => {
  const proj = getProject(parseInt(id));
  if(!proj) throw new NotFoundError();

  if(proj.public === 0 &&
    (!user || proj.author !== user.id)
  ) throw new NotFoundError();

  return getProjectData(proj, getUserWithID(proj.author)!, await jwt.sign({
      ...createExpire(60 * 5),
      project: proj.id,
    }))
}, {
  detail: { summary: "プロジェクトのメタデータを返します" },
  params: t.Object({
    id: t.String({ pattern: "^\\d+$", format: "regex", description: "プロジェクトID", examples: [1190190190, 42, 1] }),
  }),
  response: projectDataSchema
})
