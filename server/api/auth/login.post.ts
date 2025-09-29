import { verifyPassword } from '../../utils/hash';
import { createSession, destroySession } from '../../utils/session';

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody<{ email: string; password: string }>(event);
    const u = await db.User.findOne({ where: { email } });
    if (!u || !u.passwordHash || !verifyPassword(password, u.passwordHash))
        throw createError({ statusCode: 401, statusMessage: 'invalid credentials' });

    await destroySession(event);
    await createSession(event, u.index);
    await db.User.update({ index: u.index }, { lastLoginAt: new Date() });
    return { ok: true };
});
