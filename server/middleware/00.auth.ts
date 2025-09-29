import { getUserFromSession } from '../utils/session'

export default defineEventHandler(async (event) => {
    event.context.user = await getUserFromSession(event)
})
