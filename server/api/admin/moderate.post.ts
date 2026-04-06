import { PostStatusEnum } from "~/shared/types/Enum";
import { requireRole } from "../../utils/acl";

export default defineEventHandler(async (event) => {
  requireRole(event, "admin");

  const { id, action } = await readBody<{
    id: number | string;
    action: PostStatusEnum;
  }>(event);

  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw createError({ statusCode: 400, statusMessage: "invalid id" });
  }
  if (action !== PostStatusEnum.Approve && action !== PostStatusEnum.Reject) {
    throw createError({ statusCode: 400, statusMessage: "invalid action" });
  }

  const rec = await db.Post.findOneBy({ index: postId });
  if (!rec) throw createError({ statusCode: 404, statusMessage: "not found" });

  rec.status = action;
  await rec.save();

  return { ok: true };
});
