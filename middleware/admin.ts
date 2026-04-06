import { RoleEnum } from "~/shared/Enum";

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return
    const { user, loading, refresh } = useAuth()
    if (!user.value && !loading.value) await refresh()
    if (!user.value) return navigateTo('/login?next=' + encodeURIComponent(location.pathname + location.search))

    if (to.path.startsWith('/admin/users')) {
        if (!user.value.hasPerm(RoleEnum.Admin)) return navigateTo('/admin/contribute')
        return
    }

    if (!user.value.hasPerm(RoleEnum.Member)) return navigateTo('/')
})
