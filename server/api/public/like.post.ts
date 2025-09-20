//server/api/public/like.post.ts
export default defineEventHandler(async (e) => {
    const body = await readBody<{ id: string }>(e)
    const store = useStorage('assets:submissions')
    const rec = await store.getItem<any>(`/${body.id}.json`)
    if (!rec) throw createError({ statusCode: 404, statusMessage: 'not found' })
    rec.likes = (rec.likes ?? 0) + 1
    await store.setItem(`/${body.id}.json`, rec)
    return { ok: true, likes: rec.likes }
})
