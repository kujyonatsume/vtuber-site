import { hashPassword } from '../../utils/hash';
import { createSession } from '../../utils/session';
import { RoleEnum } from '../../database';

export default defineEventHandler(async (event) => {
    const { email, password, name } = await readBody<{ email: string; password: string; name?: string }>(event);
    if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'invalid' });

    const exists = await db.User.findOne({ where: { email } });
    if (exists) throw createError({ statusCode: 409, statusMessage: 'email exists' });

    const u = db.User.create({ email, passwordHash: hashPassword(password), name, role: RoleEnum.User });
    await u.save();
    await createSession(event, u.index);
    await db.User.update({ index: u.index }, { lastLoginAt: new Date() });
    return { ok: true };
});
