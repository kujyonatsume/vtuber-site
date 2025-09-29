export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) return navigateTo('/login?next=' + encodeURIComponent(location.pathname + location.search))
    if (user.value.role === 'user') return navigateTo('/') // 只有 admin/developer/owner 允許
})
