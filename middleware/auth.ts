export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) {
        return navigateTo(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    }
    // 白名單：密碼設定頁、OAuth 回調頁
    const whitelist = ['/user/password', '/auth/google', '/auth/discord']
    if (!user.value?.hasPassword && !whitelist.includes(to.path)) {
        return navigateTo('/user/password')
    }
})
