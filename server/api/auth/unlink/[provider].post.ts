import { ProviderEnum } from "~/shared/Enum"
export default defineEventHandler(async (event) => {
    const u = requireRole(event)
    if (!u) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

    const provider = (event.context.params?.provider || '').toLowerCase()
    if (!Object.values(ProviderEnum).includes(provider as ProviderEnum)) {
        throw createError({ statusCode: 400, statusMessage: 'invalid provider' })
    }

    await db.SocialAccount.delete({ userId: u.index, provider: provider as ProviderEnum })
    return { ok: true }
})
