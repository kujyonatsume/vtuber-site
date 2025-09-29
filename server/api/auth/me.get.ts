import { getUserFromSession } from '../../utils/session'
export default defineEventHandler(async (event) => {
    const u = await getUserFromSession(event)
    if (!u) return
    const full = await db.User.findOne({
        where: { index: u.index },
        relations: ['socialAccounts'],
    })
    if (!full) return
    const { index, email, name, avatar, role, provider, passwordHash, socialAccounts } = full
    const linked = (socialAccounts || []).map(s => s.provider)
    return { index, email, name, avatar, role, provider, hasPassword: !!passwordHash, linked }
})
