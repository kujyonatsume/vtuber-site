import { PostStatusEnum } from "../../database/Enum";

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const u = event.context.user as InstanceType<typeof db.User> | null;
  if (!u) throw createError({ statusCode: 401, statusMessage: "unauthorized" });

  const q = getQuery(event) as Record<string, string | undefined>;
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(q.pageSize || "10", 10)));
  const status = (q.status || "all").toLowerCase();

  const where: any = { authorId: u.index };
  if (
    status === PostStatusEnum.Pending ||
    status === PostStatusEnum.Approve ||
    status === PostStatusEnum.Reject
  ) {
    where.status = status;
  }

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
      isAnonymous: r.isAnonymous,
      displayname: r.isAnonymous ? "匿名" : r.author?.name || "未知使用者",
      category: r.category,
      message: r.message,
      assetUrl: r.assetUrl,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  };
});
