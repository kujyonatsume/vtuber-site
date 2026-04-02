export default defineEventHandler(async (e) => {
    const q = getQuery(e) as any
    const status = (q.status || 'pending') as 'pending' | 'approve' | 'reject'
    const page = Math.max(1, parseInt(q.page || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(q.pageSize || '20', 10)))
    const sortBy = String(q.sortBy || 'createdAt')
    const sortDir = String(q.sortDir || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    const orderFieldMap: Record<string, 'createdAt' | 'category' | 'index'> = {
        createdAt: 'createdAt',
        category: 'category',
        id: 'index',
    }
    const orderField = orderFieldMap[sortBy] || 'createdAt'

    const [items, total] = await db.Post.findAndCount({
        where: { status: status as any },
        relations: ['author'],
        order: { [orderField]: sortDir, index: 'DESC' } as any,
        skip: (page - 1) * pageSize,
        take: pageSize,
    })

    return {
        total,
        page,
        pageSize,
        items: items.map(p => ({
            id: p.index,
            category: p.category,
            message: p.message,
            assetUrl: p.assetUrl,
            createdAt: p.createdAt,
            author: p.author ? { id: p.author.index, name: p.author.name, email: p.author.email } : null,
        })),
    }
})
