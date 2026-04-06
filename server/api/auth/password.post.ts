import { RoleEnum } from "~/shared/Enum";
import { hashPassword } from "../../utils/hash";

export default defineEventHandler(async (event) => {
  const u = requireRole(event, RoleEnum.User);

  const { password } = await readBody<{ password?: string }>(event);
  if (!password || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: "password too short" });
  }
  // 設定或重設
  await db.User.update(
    { index: u.index },
    { passwordHash: hashPassword(password) },
  );
  return { ok: true };
});
