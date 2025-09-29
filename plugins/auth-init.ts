export default defineNuxtPlugin(async () => {
    const { user, loading, refresh } = useAuth()
    if (import.meta.server) {
        const headers = useRequestHeaders(['cookie'])
        try {
            const me = await $fetch('/api/auth/me', { headers, credentials: 'include' as any })
            if (me) user.value = me
        } catch { }
    } else {
        if (!user.value && !loading.value) await refresh()
    }
})
