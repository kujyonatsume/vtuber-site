import { PostStatusEnum, RoleEnum } from "#shared/Enum";
const pageSize = 10;

export default defineEventHandler(async (event) => {
  const u = requireRole(event);

  const q = getQuery(event) as Record<string, string | undefined>;
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const status = Object.values(PostStatusEnum).includes(q.status as PostStatusEnum)
    ? (q.status as PostStatusEnum)
    : undefined;

  const where: { authorId: number; status?: PostStatusEnum } = {
    authorId: u.index,
  };
  if (status) where.status = status;

  const [rows, total] = await db.Post.findAndCount({
    where,
    order: { createdAt: "DESC", index: "DESC" } as any,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    total,
    page,
    pageSize,
    items: rows.map((r) => ({
      id: r.index,
      displayName: r.author?.name || "未知使用者",
      category: r.category,
      message: r.message,
      assetUrl: r.assetUrl,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  };
});
