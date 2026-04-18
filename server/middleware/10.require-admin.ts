// server/middleware/10.require-admin.ts
import type { H3Event } from "h3";
import { RoleEnum } from "#shared/Enum";

export default defineEventHandler((event: H3Event) => {
  if (!event.path.startsWith("/api/admin/")) return;

  const u = requireRole(event, RoleEnum.User);

  const required = event.path.startsWith("/api/admin/users")
    ? RoleEnum.Admin
    : RoleEnum.Member;

  if (!u.hasPrem(required)) {
    throw createError({ statusCode: 403, statusMessage: "forbidden" });
  }
});
