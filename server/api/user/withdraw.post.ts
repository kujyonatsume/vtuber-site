export default defineEventHandler(async (event) => {
  // @ts-ignore
  const current = event.context.user
  if (!current) throw createError({ statusCode: 401, statusMessage: "unauthorized" });

  const { id } = await readBody<{ id: number | string }>(event);
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw createError({ statusCode: 400, statusMessage: "invalid id" });
  }

  const rec = await db.Post.findOneBy({ index: postId, authorId: current.index });
  if (!rec) throw createError({ statusCode: 404, statusMessage: "post not found" });

  // 已公開的內容不允許由使用者自行撤回，避免前台內容突然消失。
  if (rec.status === "approve") {
    throw createError({ statusCode: 400, statusMessage: "approved post cannot withdraw" });
  }

  if (rec.assetUrl?.startsWith("/static/")) {
    const { uploadBase } = useRuntimeConfig().public;
    const key = rec.assetUrl.slice(uploadBase.length);
    if (key) {
      await useStorage("static").removeItem(key).catch(() => {});
    }
  }

  await db.Post.delete({ index: postId, authorId: current.index });
  return { ok: true };
});
