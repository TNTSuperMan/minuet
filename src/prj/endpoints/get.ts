import app from "../app";
import { getProject } from "../../utils/project";
import { NotFoundError, t } from "elysia";

const textDecoder = new TextDecoder;

app.get("/:id", async ({ params: { id }, query: { token }, jwt }) => {

  const id_num = parseInt(id);

  const result = await jwt.verify(token).catch(()=>null);

  if(result === null || typeof result !== "object" || typeof result.id !== "number" || result.id !== id_num) throw new NotFoundError;

  const proj = getProject(id_num);
  if(!proj) throw new NotFoundError;

  return JSON.parse(
    typeof proj.json === "string" ?
    proj.json : textDecoder.decode(proj.json))
}, {
  detail: { summary: "プロジェクトのJSONを返します" },
  params: t.Object({
    id: t.String()
  }),
  query: t.Object({
    token: t.String()
  })
})
