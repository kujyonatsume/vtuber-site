import type { H3Event } from "h3";
import { RoleEnum } from "~/shared/Enum";

export function requireRole(event: H3Event, role: RoleEnum) {
  const u = event.context.user;
  if (!u) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  if (!u.hasPrem(role)) {
    throw createError({ statusCode: 403, statusMessage: "forbidden" });
  }
  return u;
}
