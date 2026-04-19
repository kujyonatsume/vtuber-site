<template>
  <section class="layout-container space-y-6 py-8">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">{{ t("adminUsers.title") }}</h1>
        <p class="text-sm text-neutral-800">{{ t("adminUsers.total", { total }) }}</p>
      </div>
      <div class="flex gap-2">
        <VBtn variant="tonal" rounded="lg" to="/admin/contribute">
          {{ t("adminUsers.backToReview") }}
        </VBtn>
      </div>
    </header>

    <div class="flex flex-wrap gap-3">
      <VTextField
        v-model="kw"
        density="comfortable"
        hide-details
        clearable
        :placeholder="t('adminUsers.keywordPlaceholder')"
        style="max-width: 320px"
      />

      <VSelect
        v-model="roleFilter"
        :items="roleFilterItems"
        density="comfortable"
        hide-details
        :label="t('adminUsers.filters.role')"
        style="max-width: 220px"
      />

      <VSelect
        v-model="sortBy"
        :items="sortByItems"
        density="comfortable"
        hide-details
        :label="t('adminUsers.filters.sortBy')"
        style="max-width: 180px"
      />

      <VSelect
        v-model="sortDir"
        :items="sortDirItems"
        density="comfortable"
        hide-details
        :label="t('adminUsers.filters.sortDir')"
        style="max-width: 140px"
      />

      <div class="flex-1" />
      <VBtn variant="text" :loading="pending" @click="refresh">
        {{ t("adminUsers.refresh") }}
      </VBtn>
    </div>

    <div class="overflow-x-auto rounded-xl border border-neutral-300/70 bg-white/90">
      <table class="w-full min-w-215 text-sm">
        <thead class="bg-secondary-50/70 text-left">
          <tr>
            <th class="px-4 py-3">{{ t("adminUsers.table.id") }}</th>
            <th class="px-4 py-3">{{ t("adminUsers.table.user") }}</th>
            <th class="px-4 py-3">{{ t("adminUsers.table.currentRole") }}</th>
            <th class="px-4 py-3">{{ t("adminUsers.table.linked") }}</th>
            <th class="px-4 py-3">{{ t("adminUsers.table.lastLogin") }}</th>
            <th class="px-4 py-3 text-right">{{ t("adminUsers.table.action") }}</th>
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
              <div class="font-medium">{{ it.name || t("adminUsers.table.noName") }}</div>
              <div class="text-xs text-neutral-800">{{ it.email }}</div>
            </td>
            <td class="px-4 py-3">
              <VChip size="small" color="primary" variant="tonal">
                {{ roleLabel(it.role) }}
              </VChip>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <VChip
                  v-for="provider in it.linked"
                  :key="`${it.id}-${provider}`"
                  size="x-small"
                  color="primary"
                  variant="flat"
                >
                  {{ provider }}
                </VChip>
                <span v-if="!it.linked.length" class="text-xs text-neutral-800">
                  {{ t("adminUsers.table.notLinked") }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-xs text-neutral-800">
              {{ it.lastLoginAt ? new Date(it.lastLoginAt).toLocaleString() : t("adminUsers.table.neverLogin") }}
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
            <td colspan="6" class="px-4 py-10 text-center text-neutral-800">
              {{ t("adminUsers.noData") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-center gap-2 pt-2">
      <VBtn :disabled="page <= 1" @click="page--">{{ t("pagination.prev") }}</VBtn>
      <span class="text-sm text-neutral-800">
        {{ t("pagination.pageWithTotal", { page, total: maxPage }) }}
      </span>
      <VBtn :disabled="page >= maxPage" @click="page++">{{ t("pagination.next") }}</VBtn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RoleEnum, RoleFlag } from "#shared/Enum";

definePageMeta({ middleware: ["auth", "admin"] });

const { t } = useI18n();
const { user } = useAuth();

type Item = {
  id: number;
  email: string;
  name?: string | null;
  role: RoleEnum;
  linked: string[];
  lastLoginAt?: string | null;
};

function roleLabel(role: RoleEnum) {
  if (role === RoleEnum.Owner) return t("roles.owner");
  if (role === RoleEnum.Admin) return t("roles.admin");
  if (role === RoleEnum.Member) return t("roles.member");
  return t("roles.user");
}

const roleItems = computed(() => {
  const currentRole = user.value?.role;
  if (!currentRole) return [];

  const currentLevel = RoleFlag[currentRole].value;

  return [
    { title: t("roles.owner"), value: RoleEnum.Owner },
    { title: t("roles.admin"), value: RoleEnum.Admin },
    { title: t("roles.member"), value: RoleEnum.Member },
    { title: t("roles.user"), value: RoleEnum.User },
  ].filter((item) => RoleFlag[item.value].value < currentLevel);
});

const roleFilter = ref<"all" | RoleEnum>("all");
const roleFilterItems = computed(() => [
  { title: t("adminUsers.filters.allRoles"), value: "all" },
  ...roleItems.value,
]);

const sortBy = ref<"createdAt" | "lastLoginAt" | "email" | "role" | "name">("createdAt");
const sortDir = ref<"desc" | "asc">("desc");

const sortByItems = computed(() => [
  { title: t("adminUsers.sort.createdAt"), value: "createdAt" },
  { title: t("adminUsers.sort.lastLoginAt"), value: "lastLoginAt" },
  { title: t("adminUsers.sort.email"), value: "email" },
  { title: t("adminUsers.sort.role"), value: "role" },
  { title: t("adminUsers.sort.name"), value: "name" },
]);

const sortDirItems = computed(() => [
  { title: t("adminUsers.sortDir.desc"), value: "desc" },
  { title: t("adminUsers.sortDir.asc"), value: "asc" },
]);

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
    toast.success(t("adminUsers.toast.roleUpdated"));
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("adminUsers.toast.updateFailed"));
  } finally {
    savingId.value = null;
  }
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
</style>
