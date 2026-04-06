import { RoleEnum, RoleFlag } from "~/shared/Enum";
export interface IApiUser {
  index?: number;
  email?: string;
  name?: string;
  avatar?: string;
  role?: RoleEnum;
  hasPassword?: boolean;
  linked?: string[];
}
// composables/useAuth.ts
export function useAuth() {
  const user = useState<IApiUser | null>("auth:user", () => null);
  const loading = useState<boolean>("auth:loading", () => false);

  async function refresh() {
    loading.value = true;
    try {
      // 確保帶 Cookie、避免快取
      user.value = await $fetch("/api/auth/me", {
        credentials: "include" as any,
        query: { t: Date.now() },
      });
    } finally {
      loading.value = false;
    }
  }

  function hasPerm(perm: RoleEnum) {
    const role = user.value?.role;
    if (!role) return false;
    return RoleFlag[role].has(perm);
  }

  function isProtectedPath(pathname: string) {
    if (pathname.startsWith("/admin")) return true;
    if (pathname.startsWith("/user/") && pathname !== "/user/login")
      return true;
    return false;
  }

  async function logout() {
    await $fetch("/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    user.value = null;

    if (!import.meta.client) return;

    const pathname = window.location.pathname;
    if (!isProtectedPath(pathname)) return;

    const next = encodeURIComponent(`${pathname}${window.location.search}`);
    await navigateTo(`/user/login?next=${next}`);
  }

  if (import.meta.client && user.value === null && !loading.value) {
    refresh();
  }
  return { user, loading, hasPerm, refresh, logout };
}
