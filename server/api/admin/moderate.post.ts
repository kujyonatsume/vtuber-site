//server/api/admin/moderate.post.ts
export default defineEventHandler(async (e) => {
    const key = getHeader(e, 'x-key')
    if (key !== process.env.MOD_KEY) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
    const body = await readBody<{ id: string; action: 'approve' | 'reject' }>(e)
    const rec = await useStorage('assets:submissions').getItem<any>(`/${body.id}.json`)
    if (!rec) throw createError({ statusCode: 404, statusMessage: 'not found' })
    rec.status = body.action === 'approve' ? 'approved' : 'rejected'
    await useStorage('assets:submissions').setItem(`/${body.id}.json`, rec)
    return { ok: true }
})
