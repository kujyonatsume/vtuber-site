import { RoleEnum } from "~/shared/types/Enum";
import { requireRole } from "../../../utils/acl";

const rank: Record<RoleEnum, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  user: 1,
};

function getRank(role: string): number | null {
  const v = (rank as Record<string, number | undefined>)[role];
  return Number.isFinite(v) ? (v as number) : null;
}

export default defineEventHandler(async (e) => {
  requireRole(e, "admin");

  const actor = e.context.user as { index: number; role: RoleEnum } | undefined;
  if (!actor) throw createError({ statusCode: 401, statusMessage: "unauthorized" });

  const body = await readBody<{ userId: number | string; role: RoleEnum }>(e);
  const userId = Number(body.userId);
  const role = body.role;

  if (!Number.isFinite(userId)) {
    throw createError({ statusCode: 400, statusMessage: "invalid userId" });
  }
  if (!Object.values(RoleEnum).includes(role)) {
    throw createError({ statusCode: 400, statusMessage: "invalid role" });
  }

  const u = await db.User.findOneBy({ index: userId });
  if (!u) throw createError({ statusCode: 404, statusMessage: "user not found" });

  if (actor.index === userId && actor.role !== role) {
    throw createError({ statusCode: 400, statusMessage: "cannot change your own role" });
  }
  const actorRank = getRank(actor.role);
  const targetRank = getRank(u.role);
  const nextRank = getRank(role);
  if (!actorRank || !targetRank || !nextRank) {
    throw createError({ statusCode: 403, statusMessage: "forbidden role value" });
  }

  if (targetRank > actorRank) {
    throw createError({ statusCode: 403, statusMessage: "forbidden target role" });
  }
  if (nextRank > actorRank) {
    throw createError({ statusCode: 403, statusMessage: "forbidden assign role" });
  }

  u.role = role;
  await u.save();
  return { ok: true };
});
