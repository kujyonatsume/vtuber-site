import DiscordOauth2 from 'discord-oauth2'
import { PermissionsBitField } from 'discord.js'
import { ProviderEnum } from '../../database/Enum'
import { createSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig().oauth.discord
  const oauth = new DiscordOauth2(cfg)

  if (isMethod(event, 'GET')) {
    return {
      url: oauth.generateAuthUrl({
        scope: ['identify', 'email'],
        responseType: 'code',
        ...cfg,
      }),
    }
  }

  if (!isMethod(event, 'POST')) throw createError({ statusCode: 404 })
  const { code } = await readBody<{ code?: string }>(event)
  if (!code) throw createError({ statusCode: 400, statusMessage: 'missing code' })

  const token = await oauth.tokenRequest({
    code,
    scope: ['identify', 'email'],
    grantType: 'authorization_code',
  })

  const accessToken = token.access_token
  const info = await oauth.getUser(accessToken)
  const { id: did, username, avatar, global_name, email } = info
  if (!email) throw createError({ statusCode: 400, statusMessage: 'no email from discord' })

  let u = await db.User.findOne({ where: { email } })
  if (!u) {
    u = db.User.create({
      email,
      provider: ProviderEnum.Discord,
      name: global_name || username || '',
      avatar: avatar ? `https://cdn.discordapp.com/avatars/${did}/${avatar}.png` : '',
      lastLoginAt: new Date(),
    })
  } else {
    u.lastLoginAt = new Date()
  }
  await u.save()

  // upsert SocialAccount
  const providerKey = `${ProviderEnum.Discord}:${did}`
  let sa = await db.SocialAccount.findOne({ where: { providerKey } })
  if (!sa) {
    sa = db.SocialAccount.create({
      userId: u.index,
      provider: ProviderEnum.Discord,
      providerUid: did,
      providerKey,
      email,
      accessToken,
      profileJson: JSON.stringify(info),
    })
  } else {
    sa.userId = u.index
    sa.email = email
    sa.accessToken = accessToken
    sa.profileJson = JSON.stringify(info)
  }
  await sa.save()

  await createSession(event, u.index)
  return { ok: true, user: { email: u.email, name: u.name, role: u.role }, requirePassword: !u.passwordHash }

})
