// server/middleware/10.require-admin.ts
import type { H3Event } from 'h3'
import type { RoleEnum } from '../database/Enum'

const rank: Record<RoleEnum, number> = { owner: 4, admin: 3, member: 2, user: 1 }

export default defineEventHandler((event: H3Event) => {
    if (!event.path.startsWith('/api/admin/')) return
    // @ts-ignore
    const u = event.context.user
    if (!u) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
    const currentRank = rank[u.role as RoleEnum]
    if (!Number.isFinite(currentRank) || currentRank < rank.admin) {
        throw createError({ statusCode: 403, statusMessage: 'forbidden' })
    }
})
