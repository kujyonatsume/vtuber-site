import { randomBytes, createHmac } from 'crypto'
import dayjs from 'dayjs'
import { H3Event } from 'h3'

const COOKIE = 'sid'
const DAYS = 14
const SLIDING_THRESHOLD_HOURS = 72 // 距到期 < 72h 自動延長

export async function createSession(event: H3Event, userId: number) {
    const config = useRuntimeConfig()
    if (!config.sessionSecret) throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET missing' })

    const raw = randomBytes(32).toString('hex')
    const token = sign(raw, config.sessionSecret)
    const expires = dayjs().add(DAYS, 'day').toDate()

    // 一對一：若已存在，直接覆寫 token / 到期
    let s = await db.Session.findOne({ where: { userId } })
    if (s) {
        s.token = token
        s.expiresAt = expires
        s.revokedAt = null as any
    } else {
        s = db.Session.create({ userId, token, expiresAt: expires })
    }
    await s.save()

    const { secure, domain } = pickCookieAttrs(event)
    setCookie(event, COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
        domain,
        maxAge: 60 * 60 * 24 * DAYS,
    })
}

export async function touchSession(event: H3Event, patch: Partial<{
    token: string
    extendDays: number
    revoke: boolean
}>) {
    const token = getCookie(event, COOKIE)
    if (!token) return
    const s = await db.Session.findOne({ where: { token } })
    if (!s) return

    if (patch.revoke) {
        s.revokedAt = new Date()
    }
    if (patch.extendDays && patch.extendDays > 0) {
        s.expiresAt = dayjs(s.expiresAt).add(patch.extendDays, 'day').toDate()
    }
    if (patch.token) {
        s.token = patch.token
    }
    await s.save()
}

export async function destroySession(event: H3Event) {
    const token = getCookie(event, COOKIE)
    if (!token) return
    await db.Session.delete({ token })
    deleteCookie(event, COOKIE, { path: '/' })
}

export async function getUserFromSession(event: H3Event) {
    const token = getCookie(event, COOKIE)
    if (!token) return
    const s = await db.Session.findOne({ where: { token } })
    if (!s || s.revokedAt) return

    // 過期處理
    if (new Date(s.expiresAt).getTime() < Date.now()) {
        await db.Session.delete({ id: s.id })
        return
    }

    // 滑動過期：接近到期自動延長
    const leftHours = dayjs(s.expiresAt).diff(dayjs(), 'hour')
    if (leftHours < SLIDING_THRESHOLD_HOURS) {
        s.expiresAt = dayjs().add(DAYS, 'day').toDate()
        await s.save()
    }
    return await db.User.findOne({ where: { index: s.userId } })
}

function pickCookieAttrs(event: H3Event) {
    const proto = getRequestHeader(event, 'x-forwarded-proto') || 'http'
    const host = getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host') || ''
    const secure = proto === 'https'
    const hostname = host.split(':')[0]
    const domain = hostname.split('.').length > 2 ? `.${hostname.split('.').slice(-2).join('.')}` : undefined
    return { secure, domain }
}

function sign(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('hex')
}
