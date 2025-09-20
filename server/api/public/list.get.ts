//server/api/public/list.get.ts
export default defineEventHandler(async () => {
    const store = useStorage('assets:submissions')
    const keys = await store.getKeys('/')
    const items: any[] = []
    for (const k of keys) {
        const rec = await store.getItem<any>(`/${k}`)
        if (rec && rec.status === 'approved') items.push(rec)
    }
    items.sort((a, b) => b.createdAt - a.createdAt)
    return items
})
