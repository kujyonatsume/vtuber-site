import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

export function hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(password, salt, 64).toString('hex')
    return `${salt}:${hash}`
}
export function verifyPassword(password: string, stored: string) {
    const [salt, hash] = stored.split(':') as [string, string]
    const buf1 = Buffer.from(hash, 'hex')
    const buf2 = scryptSync(password, salt, 64)
    return timingSafeEqual(buf1, buf2)
}
