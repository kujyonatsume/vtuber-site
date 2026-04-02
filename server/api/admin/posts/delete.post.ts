import { requireRole } from "../../../utils/acl";

export default defineEventHandler(async (event) => {
  requireRole(event, "admin");

  const { id } = await readBody<{ id: number | string }>(event);
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw createError({ statusCode: 400, statusMessage: "invalid id" });
  }

  const rec = await db.Post.findOneBy({ index: postId });
  if (!rec) throw createError({ statusCode: 404, statusMessage: "not found" });

  // 若附件是本地 static 檔案，順便刪除避免孤兒檔案累積。
  if (rec.assetUrl?.startsWith("/static/")) {
    const { uploadBase } = useRuntimeConfig().public;
    const key = rec.assetUrl.slice(uploadBase.length);
    if (key) {
      await useStorage("static").removeItem(key).catch(() => {});
    }
  }

  await db.Post.delete({ index: postId });
  return { ok: true };
});
