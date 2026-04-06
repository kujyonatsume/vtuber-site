import { RoleEnum } from "#build/server/database"

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) return navigateTo('/login?next=' + encodeURIComponent(location.pathname + location.search))

    const role = String(user.value.role || '')

    console.log('Current user role:', RoleEnum[0], RoleEnum[1], RoleEnum[2], RoleEnum[3])

    if (to.path.startsWith('/admin/users')) {
        const usersAllow = ['owner', 'admin'] as const
        if (!usersAllow.includes(role as any)) return navigateTo('/admin/contribute')
        return
    }

    const allow = ['owner', 'admin', 'member'] as const
    if (!allow.includes(role as any)) return navigateTo('/')
})
