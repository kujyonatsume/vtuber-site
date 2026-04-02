import { ProviderEnum } from '../../database/Enum'
import { google } from 'googleapis'
import { createSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig().oauth.google
  const oauth2Client = new google.auth.OAuth2(cfg)
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })

  if (isMethod(event, 'GET')) {
    return {
      url: oauth2Client.generateAuthUrl({
        access_type: 'offline',
        client_id: cfg.clientId,
        redirect_uri: cfg.redirectUri,
        prompt: 'consent',
        scope: ['openid', 'email', 'profile'],
        response_type: 'code',
      }),
    }
  }

  if (!isMethod(event, 'POST')) throw createError({ statusCode: 404 })
  const { code } = await readBody<{ code?: string }>(event)
  if (!code) throw createError({ statusCode: 400, statusMessage: 'missing code' })

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const { data } = await oauth2.userinfo.get()
  if (!data.email) throw createError({ statusCode: 400, statusMessage: 'no email from google' })

  // 1) 先找 user（以 email 為準）
  let u = await db.User.findOne({ where: { email: data.email } })
  if (!u) {
    u = db.User.create({
      email: data.email!,
      name: data.name || data.given_name || '',
      avatar: data.picture || '',
      lastLoginAt: new Date(),
    })
  } else {
    u.lastLoginAt = new Date()
  }
  await u.save()

  // 2) upsert SocialAccount
  const providerUid = (data as any).id || data.email!
  const providerKey = `${ProviderEnum.Google}:${providerUid}`
  let sa = await db.SocialAccount.findOne({ where: { providerKey } })
  if (!sa) {
    sa = db.SocialAccount.create({
      userId: u.index,
      provider: ProviderEnum.Google,
      providerUid,
      providerKey,
      email: data.email!,
      accessToken: tokens.access_token || undefined,
      refreshToken: tokens.refresh_token || undefined,
      profileJson: JSON.stringify(data),
    })
  } else {
    sa.userId = u.index
    sa.accessToken = tokens.access_token || sa.accessToken
    sa.refreshToken = tokens.refresh_token || sa.refreshToken
    sa.email = data.email!
    sa.profileJson = JSON.stringify(data)
  }
  await sa.save()

  await createSession(event, u.index)
  return { ok: true, user: { email: u.email, name: u.name, role: u.role }, requirePassword: !u.passwordHash }

})
