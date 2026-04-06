import type { RoleEnum } from "#build/server/database";

interface IApiUser {
    index: number;
    email: string;
    name: string;
    avatar: string;
    role: RoleEnum;
    hasPassword: boolean;
    linked: string[];
}
// composables/useAuth.ts
export function useAuth() {
    const user = useState<IApiUser>("auth:user", () => null);
    const loading = useState<boolean>("auth:loading", () => false);

    async function refresh() {
        loading.value = true;
        try {
            // 確保帶 Cookie、避免快取
            user.value = await $fetch("/api/auth/me", {
                credentials: "include" as any,
                query: { t: Date.now() },
            }).catch(() => null);
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        await $fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include" as any,
        });
        user.value = null;
    }

    if (import.meta.client && user.value === null && !loading.value) {
        refresh();
    }
    return { user, loading, refresh, logout };
}
