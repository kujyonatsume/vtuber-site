import { PostStatusEnum } from "#shared/Enum";
import { Equal, Like, MoreThan } from "typeorm";

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 30;

function mergeWhere(...parts: Array<Record<string, any>>) {
  const merged: Record<string, any> = {};
  parts.forEach((part) => {
    Object.entries(part).forEach(([key, value]) => {
      if (key === "author" && value && typeof value === "object") {
        merged.author = { ...(merged.author || {}), ...(value as object) };
        return;
      }
      merged[key] = value;
    });
  });
  return merged;
}

function parseTermList(raw: string | undefined) {
  if (!raw) return [];
  const seen = new Set<string>();
  const output: string[] = [];

  raw
    .split(/[\s,]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .forEach((part) => {
      if (seen.has(part)) return;
      seen.add(part);
      output.push(part);
    });

  return output;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, string | undefined>;
  const parsedLimit = parseInt(query.limit || `${DEFAULT_LIMIT}`, 10);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.isFinite(parsedLimit) ? parsedLimit : DEFAULT_LIMIT),
  );

  const keyword = (query.q || "").trim().toLowerCase();
  const authorTerms = parseTermList(query.authors || query.author);
  const tagTerms = parseTermList(query.tags || query.tag).map((tag) =>
    tag.startsWith("#") ? tag.slice(1) : tag,
  );
  const cursorCreatedAt = (query.cursorCreatedAt || "").trim();
  const cursorIdParsed = parseInt(query.cursorId || "", 10);
  const keywordLike = `%${keyword}%`;
  const hasKeyword = Boolean(keyword);
  const hasAuthorFilter = authorTerms.length > 0;

  const keywordWhere = hasKeyword
    ? [
        { message: Like(keywordLike) },
        { category: Like(keywordLike) },
        ...(hasAuthorFilter ? [] : [{ author: { name: Like(keywordLike) } }]),
      ]
    : [{}];

  const authorWhere = hasAuthorFilter
    ? authorTerms.map((name) => ({ author: { name: Like(`%${name}%`) } }))
    : [{}];

  const tagWhere = tagTerms.length
    ? tagTerms.map((tag) => ({ message: Like(`%#${tag}%`) }))
    : [{}];

  const baseWhere = keywordWhere.flatMap((keywordClause) =>
    authorWhere.flatMap((authorClause) =>
      tagWhere.map((tagClause) =>
        mergeWhere(
          { status: PostStatusEnum.Approve },
          keywordClause,
          authorClause,
          tagClause,
        ),
      ),
    ),
  );

  let where = baseWhere as any[];

  if (cursorCreatedAt) {
    const d = new Date(cursorCreatedAt);
    if (!Number.isNaN(d.getTime())) {
      const cursorDate = d.toISOString();
      if (Number.isFinite(cursorIdParsed)) {
        where = baseWhere.flatMap((w) => [
          { ...w, createdAt: MoreThan(cursorDate) },
          { ...w, createdAt: Equal(cursorDate), index: MoreThan(cursorIdParsed) },
        ]);
      } else {
        where = baseWhere.map((w) => ({ ...w, createdAt: MoreThan(cursorDate) }));
      }
    }
  }

  const rows = await db.Post.find({
    where,
    relations: ["author"],
    order: { createdAt: "ASC", index: "ASC" },
    take: limit + 1,
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items.length ? items[items.length - 1] : null;

  return {
    hasMore,
    nextCursor:
      hasMore && last
        ? {
            createdAt: new Date(last.createdAt).toISOString(),
            id: last.index,
          }
        : null,
    items: items.map((r: any) => ({
      displayName: r.author?.name || "Unknown",
      id: r.index,
      category: r.category,
      message: r.message,
      assetUrl: r.assetUrl,
      createdAt: r.createdAt,
    })),
  };
});
