export default defineEventHandler(async () => {
    const rows = await db.Post.find({
        where: { status: 'approve' as any },
        relations: ['author'],
        order: { createdAt: 'DESC' },
    })

    // 前端目前讀取 it.nickname；這裡補出對應欄位以維持相容
    return rows.map(r => ({
        id: r.index,
        category: r.category,
        message: r.message,
        assetUrl: r.assetUrl,
        createdAt: r.createdAt,
        nickname: r.displayname
    }))
})
