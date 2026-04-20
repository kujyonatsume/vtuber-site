import { PostStatusEnum } from "#shared/Enum";

const pageSize = 10;

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: "invalid user id" });
  }

  const profile = await db.User.findOne({
    where: { index: id },
    select: {
      index: true,
      name: true,
      avatar: true,
    } as any,
  });
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: "user not found" });
  }

  const q = getQuery(event) as Record<string, string | undefined>;
  const page = Math.max(1, parseInt(q.page || "1", 10));

  const [rows, total] = await db.Post.findAndCount({
    where: {
      authorId: id,
      status: PostStatusEnum.Approve,
      isAnonymous: false,
    },
    order: { createdAt: "DESC", index: "DESC" } as any,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    profile: {
      id: profile.index,
      name: profile.name?.trim() || `User #${profile.index}`,
      avatar: profile.avatar || null,
    },
    total,
    page,
    pageSize,
    items: rows.map((row) => ({
      id: row.index,
      category: row.category,
      message: row.message,
      assetUrl: row.assetUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })),
  };
});
