import { PostStatusEnum } from "~/shared/Enum";

export default defineEventHandler(async () => {
  const rows = await db.Post.find({
    where: { status: PostStatusEnum.Approve },
    relations: ["author"],
    order: { createdAt: "ASC" },
  });

  return rows.map((r) => ({
    displayName: r.isAnonymous ? "匿名" : r.author?.name || "匿名",
    isAnonymous: r.isAnonymous,
    id: r.index,
    category: r.category,
    message: r.message,
    assetUrl: r.assetUrl,
    createdAt: r.createdAt,
  }));
});
