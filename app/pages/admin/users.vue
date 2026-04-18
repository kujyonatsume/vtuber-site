<template>
  <section class="py-8 space-y-6 layout-container">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">使用者管理</h1>
        <p class="text-sm text-neutral-800">共 {{ total }} 位使用者</p>
      </div>
      <div class="flex gap-2">
        <VBtn variant="tonal" rounded="lg" to="/admin/contribute">返回審核</VBtn>
      </div>
    </header>

    <div class="flex flex-wrap gap-3">
      <VTextField
        v-model="kw"
        density="comfortable"
        hide-details
        clearable
        placeholder="搜尋 Email / 顯示名稱"
        style="max-width: 320px"
      />
      <VSelect
        v-model="roleFilter"
        :items="roleFilterItems"
        density="comfortable"
        hide-details
        label="角色篩選"
        style="max-width: 220px"
      />
      <VSelect
        v-model="sortBy"
        :items="sortByItems"
        density="comfortable"
        hide-details
        label="排序欄位"
        style="max-width: 180px"
      />
      <VSelect
        v-model="sortDir"
        :items="sortDirItems"
        density="comfortable"
        hide-details
        label="排序方向"
        style="max-width: 140px"
      />
      <div class="flex-1" />
      <VBtn variant="text" :loading="pending" @click="refresh">重新整理</VBtn>
    </div>

    <div class="overflow-x-auto border rounded-xl border-neutral-300/70 bg-white/90">
      <table class="w-full min-w-[860px] text-sm">
        <thead class="text-left bg-secondary-50/70">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">使用者</th>
            <th class="px-4 py-3">目前角色</th>
            <th class="px-4 py-3">綁定來源</th>
            <th class="px-4 py-3">最後登入</th>
            <th class="px-4 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="it in items"
            :key="it.id"
            class="border-t border-neutral-200/80 hover:bg-secondary-50/40"
          >
            <td class="px-4 py-3 font-mono text-xs">{{ it.id }}</td>
            <td class="px-4 py-3">
              <div class="font-medium">{{ it.name || "未設定名稱" }}</div>
              <div class="text-xs text-neutral-800">{{ it.email }}</div>
            </td>
            <td class="px-4 py-3">
              <VChip size="small" color="primary" variant="tonal">
                {{ roleText[it.role] || it.role }}
              </VChip>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <VChip
                  v-for="p in it.linked"
                  :key="`${it.id}-${p}`"
                  size="x-small"
                  color="primary"
                  variant="flat"
                >
                  {{ p }}
                </VChip>
                <span v-if="!it.linked.length" class="text-xs text-neutral-800">未綁定</span>
              </div>
            </td>
            <td class="px-4 py-3 text-xs text-neutral-800">
              {{ it.lastLoginAt ? new Date(it.lastLoginAt).toLocaleString() : "未登入" }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-2">
                <VSelect
                  :model-value="it.role"
                  :items="roleItems"
                  density="compact"
                  hide-details
                  style="max-width: 150px"
                  :disabled="savingId === it.id"
                  @update:model-value="(val) => updateRole(it, String(val) as RoleEnum)"
                />
                <VProgressCircular
                  v-if="savingId === it.id"
                  size="18"
                  width="2"
                  indeterminate
                />
              </div>
            </td>
          </tr>
          <tr v-if="!pending && !items.length">
            <td colspan="6" class="px-4 py-10 text-center text-neutral-800">無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-center gap-2 pt-2">
      <VBtn :disabled="page <= 1" @click="page--">上一頁</VBtn>
      <span class="text-sm text-neutral-800">第 {{ page }} 頁 / 共 {{ maxPage }} 頁</span>
      <VBtn :disabled="page >= maxPage" @click="page++">下一頁</VBtn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RoleEnum, RoleFlag } from "#shared/Enum";
definePageMeta({ middleware: ["auth", "admin"] });

const { user } = useAuth();

type Item = {
  id: number;
  email: string;
  name?: string | null;
  role: RoleEnum;
  linked: string[];
  lastLoginAt?: string | null;
};

const roleText: Record<RoleEnum, string> = {
  [RoleEnum.Owner]: "Owner",
  [RoleEnum.Admin]: "Admin",
  [RoleEnum.Member]: "Member",
  [RoleEnum.User]: "User",
};

const roleItems = computed(() => {
  const currentRole = user.value?.role

  if (!currentRole) return []

  const currentLevel = RoleFlag[currentRole].value

  return [
    { title: "Owner", value: RoleEnum.Owner },
    { title: "Admin", value: RoleEnum.Admin },
    { title: "Member", value: RoleEnum.Member },
    { title: "User", value: RoleEnum.User },
  ].filter((it) => RoleFlag[it.value].value < currentLevel)
})

const roleFilter = ref<"all" | RoleEnum>("all");
const roleFilterItems = computed(() => [
  { title: "全部角色", value: "all" },
  ...roleItems.value,
]);
const sortBy = ref<"createdAt" | "lastLoginAt" | "email" | "role" | "name">("createdAt");
const sortDir = ref<"desc" | "asc">("desc");
const sortByItems = [
  { title: "建立時間", value: "createdAt" },
  { title: "最後登入", value: "lastLoginAt" },
  { title: "Email", value: "email" },
  { title: "角色", value: "role" },
  { title: "名稱", value: "name" },
];
const sortDirItems = [
  { title: "遞減", value: "desc" },
  { title: "遞增", value: "asc" },
];

const page = ref(1);
const pageSize = ref(20);
const kw = ref("");

watch([kw, roleFilter, sortBy, sortDir], () => {
  page.value = 1;
});

const { data, pending, refresh } = await useFetch("/api/admin/users", {
  query: computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    kw: kw.value || undefined,
    role: roleFilter.value === "all" ? undefined : roleFilter.value,
    sortBy: sortBy.value,
    sortDir: sortDir.value,
  })),
  watch: [page, pageSize, kw, roleFilter, sortBy, sortDir],
});

const items = computed<Item[]>(() => (data.value?.items || []) as Item[]);
const total = computed(() => Number(data.value?.total || 0));
const maxPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

const savingId = ref<number | null>(null);

async function updateRole(it: Item, role: RoleEnum) {
  if (it.role === role) return;

  savingId.value = it.id;
  try {
    await $fetch("/api/admin/users/role", {
      method: "POST",
      body: { userId: it.id, role },
    });
    toast.success("角色已更新");
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || "更新失敗");
  } finally {
    savingId.value = null;
  }
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}
</style>
