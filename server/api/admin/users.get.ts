import { Like } from "typeorm";
import { RoleEnum } from "~/shared/types/Enum";

export default defineEventHandler(async (e) => {
  const q = getQuery(e) as Record<string, string | undefined>;
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(q.pageSize || "20", 10)));
  const kw = (q.kw || "").trim();
  const role = (q.role || "").trim() as RoleEnum | "";
  const sortBy = String(q.sortBy || "createdAt");
  const sortDir = String(q.sortDir || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

  const hasRole = Object.values(RoleEnum).includes(role as RoleEnum);
  const orderFieldMap: Record<string, "createdAt" | "lastLoginAt" | "email" | "role" | "name"> = {
    createdAt: "createdAt",
    lastLoginAt: "lastLoginAt",
    email: "email",
    role: "role",
    name: "name",
  };
  const orderField = orderFieldMap[sortBy] || "createdAt";

  let where: any = {};
  if (kw) {
    const likes = [
      { email: Like(`%${kw}%`) },
      { name: Like(`%${kw}%`) },
    ];
    where = hasRole ? likes.map((it) => ({ ...it, role })) : likes;
  } else if (hasRole) {
    where = { role };
  }

  const [items, total] = await db.User.findAndCount({
    where,
    relations: ["socialAccounts"],
    order: { [orderField]: sortDir, index: "DESC" } as any,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    total,
    page,
    pageSize,
    items: items.map((u) => ({
      id: u.index,
      email: u.email,
      name: u.name,
      avatar: u.avatar,
      role: u.role,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      linked: [...new Set((u.socialAccounts || []).map((sa) => sa.provider))],
    })),
  };
});
