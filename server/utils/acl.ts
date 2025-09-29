import type { H3Event } from 'h3';
import type { RoleEnum } from '../database/Enum';

const rank: Record<RoleEnum, number> = { owner: 4, developer: 3, admin: 2, user: 1 };

export function requireRole(event: H3Event, role: Role) {
    const u = (event.context as any).user;
    if (!u) throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
    if (rank[u.role] < rank[role]) {
        throw createError({ statusCode: 403, statusMessage: 'forbidden' });
    }
}
