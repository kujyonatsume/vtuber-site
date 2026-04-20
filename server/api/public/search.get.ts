import { PostStatusEnum } from "#shared/Enum";

const postPageSize = 10;
const userLimit = 8;

type UserSearchRow = {
  id: number;
  name: string | null;
  avatar: string | null;
};

type PostSearchRow = {
  id: number;
  category: string;
  message: string;
  assetUrl: string | null;
  isAnonymous: number | boolean | string;
  createdAt: string | Date;
  authorId: number | null;
  authorName: string | null;
  authorAvatar: string | null;
};

export default defineEventHandler(async (event) => {
  const rawKeyword = String(getQuery(event).q || "").trim();
  const parsedPage = parseInt(String(getQuery(event).page || "1"), 10);
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

  if (!rawKeyword) {
    return {
      users: [],
      posts: [],
      postTotal: 0,
      postPage: page,
      postPageSize,
    };
  }

  const keyword = rawKeyword.toLowerCase();

  const userRows = await db.User.createQueryBuilder("u")
    .select([
      "u.index AS id",
      "u.name AS name",
      "u.avatar AS avatar",
      "u.updatedAt AS updatedAt",
    ])
    .where("(u.name IS NOT NULL AND TRIM(u.name) <> '')")
    .andWhere("LOWER(u.name) LIKE :kw", { kw: `%${keyword}%` })
    .orderBy(
      "CASE WHEN LOWER(u.name) = :exact THEN 0 WHEN LOWER(u.name) LIKE :prefix THEN 1 ELSE 2 END",
      "ASC",
    )
    .setParameters({ exact: keyword, prefix: `${keyword}%` })
    .addOrderBy("u.updatedAt", "DESC")
    .limit(userLimit)
    .getRawMany<UserSearchRow>();

  const postQb = db.Post.createQueryBuilder("p")
    .leftJoin("p.author", "u")
    .where("p.status = :status", { status: PostStatusEnum.Approve })
    .andWhere(
      "(LOWER(p.message) LIKE :kw OR (u.name IS NOT NULL AND LOWER(u.name) LIKE :kw))",
      { kw: `%${keyword}%` },
    );

  const postTotal = await postQb.getCount();
  const postRows = await postQb
    .select([
      "p.index AS id",
      "p.category AS category",
      "p.message AS message",
      "p.assetUrl AS assetUrl",
      "p.isAnonymous AS isAnonymous",
      "p.createdAt AS createdAt",
      "u.index AS authorId",
      "u.name AS authorName",
      "u.avatar AS authorAvatar",
    ])
    .orderBy("p.createdAt", "DESC")
    .addOrderBy("p.index", "DESC")
    .skip((page - 1) * postPageSize)
    .take(postPageSize)
    .getRawMany<PostSearchRow>();

  return {
    users: userRows.map((row) => ({
      id: Number(row.id),
      name: row.name?.trim() || `User #${row.id}`,
      avatar: row.avatar || null,
    })),
    posts: postRows.map((row) => {
      const isAnonymous = typeof row.isAnonymous === "boolean"
        ? row.isAnonymous
        : String(row.isAnonymous) === "1" || String(row.isAnonymous).toLowerCase() === "true";

      const authorId = row.authorId ? Number(row.authorId) : null;
      const authorName = row.authorName?.trim() || null;

      return {
        id: Number(row.id),
        category: row.category,
        message: row.message,
        assetUrl: row.assetUrl || null,
        createdAt: row.createdAt,
        isAnonymous,
        authorId: isAnonymous ? null : authorId,
        authorName: isAnonymous ? null : authorName,
        authorAvatar: isAnonymous ? null : row.authorAvatar || null,
      };
    }),
    postTotal,
    postPage: page,
    postPageSize,
  };
});
