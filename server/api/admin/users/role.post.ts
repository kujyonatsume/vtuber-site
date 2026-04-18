import { RoleEnum } from "#shared/Enum";

export default defineEventHandler(async (e) => {
  const actor = requireRole(e, RoleEnum.Admin);
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
  if (!u)
    throw createError({ statusCode: 404, statusMessage: "user not found" });

  if (actor.index === userId && actor.role !== role) {
    throw createError({
      statusCode: 400,
      statusMessage: "cannot change your own role",
    });
  }
  const actorRank = actor.role;
  const targetRank = u.role;
  const nextRank = role;
  if (!actorRank || !targetRank || !nextRank) {
    throw createError({
      statusCode: 403,
      statusMessage: "forbidden role value",
    });
  }

  if (targetRank > actorRank) {
    throw createError({
      statusCode: 403,
      statusMessage: "forbidden target role",
    });
  }
  if (nextRank > actorRank) {
    throw createError({
      statusCode: 403,
      statusMessage: "forbidden assign role",
    });
  }

  u.role = role;
  await u.save();
  return { ok: true };
});
