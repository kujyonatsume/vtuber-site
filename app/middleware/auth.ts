export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) {
        return navigateTo(`/user/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    }
    // 白名單：密碼設定頁、OAuth 回調頁
    const whitelist = ['/user/account', '/auth/google', '/auth/discord']
    const isWhitelisted = whitelist.some((path) => to.path === path || to.path.endsWith(path))
    if (!user.value?.hasPassword && !isWhitelisted) {
        return navigateTo('/user/account#password')
    }
})
