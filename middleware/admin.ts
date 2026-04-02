export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) return navigateTo('/login?next=' + encodeURIComponent(location.pathname + location.search))
    const allow = ['owner', 'admin', 'member'] as const
    if (!allow.includes(user.value.role as any)) return navigateTo('/')
})
