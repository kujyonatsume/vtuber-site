import { PostStatusEnum } from '../../../server/database';
import { requireRole } from '../../utils/acl';
export default defineEventHandler(async (e) => {
    requireRole(e, 'admin')
    const { id, action } = await readBody<{ id: number; action: 'approve' | 'reject' }>(e);
    console.log(id, action);

    const rec = await db.Post.findOneBy({ index: Number(id) });
    if (!rec) throw createError({ statusCode: 404, statusMessage: 'not found' });
    rec.status = action as PostStatusEnum;
    await rec.save();
    console.log(rec);

    return { ok: true };
});
