export default defineEventHandler(async (e) => {
    const { id } = await readBody<{ id: string | number }>(e)
    const rec = await db.Post.findOneBy({ index: Number(id) })
    if (!rec) throw createError({ statusCode: 404, statusMessage: 'not found' })
    rec.likes = (rec.likes ?? 0) + 1
    await db.Post.save(rec)
    return { ok: true, likes: rec.likes }
})
