//server/api/public/submit.post.ts

import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (e) => {
    const form = await readMultipartFormData(e)
    const id = randomUUID()
    const record: any = {
        id,
        nickname: form?.find(i => i.name === 'nickname')?.data?.toString() ?? '匿名',
        contact: form?.find(i => i.name === 'contact')?.data?.toString() ?? '',
        category: form?.find(i => i.name === 'category')?.data?.toString() ?? '其他',
        message: form?.find(i => i.name === 'message')?.data?.toString() ?? '',
        videoUrl: form?.find(i => i.name === 'videoUrl')?.data?.toString() ?? '',
        assetUrl: '',
        status: 'pending',
        createdAt: Date.now(),
        likes: 0
    }
    await useStorage('submissions').setItem(`/${id}.json`, record)
    return { id }
})
