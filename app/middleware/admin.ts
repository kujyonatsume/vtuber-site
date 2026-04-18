import { RoleEnum, RoleFlag } from "#shared/Enum";

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return
    const { user, loading, refresh, hasPerm } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) return navigateTo('/user/login?next=' + encodeURIComponent(location.pathname + location.search))

    if (to.path.startsWith('/admin/users')) {
        if (!hasPerm(RoleEnum.Admin)) return navigateTo('/admin/contribute')
        return
    }

    if (!hasPerm(RoleEnum.Member)) return navigateTo('/')
})
