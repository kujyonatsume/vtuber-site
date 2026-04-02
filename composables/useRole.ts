// composables/useRole.ts
export type Role = 'owner' | 'admin' | 'member' | 'user';

const rank: Record<Role, number> = {
    owner: 4, admin: 3, member: 2, user: 1,
};

export function useRole() {
    const { user } = useAuth();
    const isAtLeast = (min: Role) => {
        const r = user.value?.role as Role | undefined;
        if (!r) return false;
        if (!(r in rank)) return false;
        return rank[r] >= rank[min];
    };
    return { isAtLeast, rank };
}
