// server/api/submit.post.ts
import { randomUUID } from 'node:crypto'
// ↑ 如果你 Enum 已在 server/database/Enum 匯出，就保持這條

export default defineEventHandler(async (e) => {
    const form = await readMultipartFormData(e)
    if (!form) throw createError({ statusCode: 400, statusMessage: 'bad form' })
    const get = (k: string) => form.find(i => i.name === k)?.data?.toString()

    // 顯示名稱：支援 isnick / displayname / nickname 三種來源
    const asBool = (v?: string) => ['1', 'true', 'yes', 'on'].includes((v || '').toLowerCase())
    const displayname =
        asBool(get('isnick')) ? '匿名' : (get('displayname') || get('nickname') || '匿名')

    const message = get('message') || ''
    const category = (get('category') as any) || 'other' // 交給 DB 預設/Enum 也可
    const videoUrl = get('videoUrl') || ''

    // 檔案 or 外部連結 -> assetUrl
    let assetUrl: string | undefined
    const file = form.find(i => i.name === 'file' && i.filename && i.type && i.data)
    if (file) {
        const id = `${Date.now()}_${randomUUID()}`
        const ext = file.filename!.split('.').pop() || 'bin'
        const key = `/${id}.${ext}`
        // ✅ 只用 nitro.storage.static（你已在 nuxt.config 設定）
        await useStorage('static').setItemRaw(key, file.data)
        const { uploadBase } = useRuntimeConfig().public // '/static'
        assetUrl = `${uploadBase}${key}`
    } else if (videoUrl) {
        assetUrl = videoUrl
    }

    // 綁定作者（若已登入）
    // @ts-ignore
    const current = e.context.user as InstanceType<typeof db.User> | null

    const rec = db.Post.create({
        displayname,
        category,
        message,
        assetUrl,
        authorId: current?.index,
        author: current ? ({ index: current.index } as any) : undefined,
    })
    await rec.save()

    return { index: rec.index, assetUrl: rec.assetUrl }
})
