// composables/useRole.ts
export type Role = 'owner' | 'developer' | 'admin' | 'user';

const rank: Record<Role, number> = {
    owner: 4, developer: 3, admin: 2, user: 1,
};

export function useRole() {
    const { user } = useAuth();
    const isAtLeast = (min: Role) => {
        const r = user.value?.role as Role | undefined;
        if (!r) return false;
        return rank[r] >= rank[min];
    };
    return { isAtLeast, rank };
}
