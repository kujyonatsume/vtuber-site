import type { H3Event } from 'h3';
type Role = 'owner' | 'admin' | 'member' | 'user';

const rank: Record<Role, number> = { owner: 4, admin: 3, member: 2, user: 1 };

export function requireRole(event: H3Event, role: Role) {
    const u = (event.context as any).user;
    if (!u) throw createError({ statusCode: 401, statusMessage: 'unauthorized' });
    const current = u.role as Role;
    if (!(current in rank)) {
        throw createError({ statusCode: 403, statusMessage: 'forbidden' });
    }
    if (rank[current] < rank[role]) {
        throw createError({ statusCode: 403, statusMessage: 'forbidden' });
    }
}
