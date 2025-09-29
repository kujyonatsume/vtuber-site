export default defineEventHandler(async () => {
    const [p, a, r] = await Promise.all([
        db.Post.count({ where: { status: 'pending' as any } }),
        db.Post.count({ where: { status: 'approve' as any } }),
        db.Post.count({ where: { status: 'reject' as any } }),
    ])
    return { pending: p, approve: a, reject: r }
})
