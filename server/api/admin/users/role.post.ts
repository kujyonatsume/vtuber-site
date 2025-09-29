import { RoleEnum } from '../../../database/Enum';
import { requireRole } from '../../../utils/acl';

export default defineEventHandler(async (e) => {
    requireRole(e, "admin");
    const { userId, role } = await readBody<{ userId: number; role: RoleEnum }>(e);
    const u = await db.User.findOneBy({ index: userId });
    if (!u) throw createError({ statusCode: 404, statusMessage: 'user not found' });
    u.role = role; await u.save();
    return { ok: true };
})
