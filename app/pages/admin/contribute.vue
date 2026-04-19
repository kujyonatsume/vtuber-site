<template>
  <section class="layout-container space-y-6 py-8">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">{{ t("adminContribute.title") }}</h1>
      <div v-if="hasPerm(RoleEnum.Admin)" class="flex items-center gap-3">
        <VBtn to="/admin/users" variant="tonal" rounded="lg">
          {{ t("adminContribute.usersButton") }}
        </VBtn>
        <div class="text-sm text-neutral-800">{{ t("adminContribute.total", { total }) }}</div>
      </div>
    </header>

    <div class="flex flex-wrap gap-2">
      <VBtn
        :color="tab === 'pending' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('pending')"
      >
        {{ t("adminContribute.tabs.pending") }}
      </VBtn>
      <VBtn
        :color="tab === 'approve' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('approve')"
      >
        {{ t("adminContribute.tabs.approve") }}
      </VBtn>
      <VBtn
        :color="tab === 'reject' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('reject')"
      >
        {{ t("adminContribute.tabs.reject") }}
      </VBtn>

      <div class="flex-1" />

      <VTextField
        v-model="kw"
        density="comfortable"
        hide-details
        :placeholder="t('adminContribute.filters.keywordPlaceholder')"
        style="max-width: 240px"
      />

      <VSelect
        v-model="sortBy"
        :items="sortByItems"
        density="comfortable"
        hide-details
        :label="t('adminContribute.filters.sortBy')"
        style="max-width: 160px"
      />

      <VSelect
        v-model="sortDir"
        :items="sortDirItems"
        density="comfortable"
        hide-details
        :label="t('adminContribute.filters.sortDir')"
        style="max-width: 140px"
      />
    </div>

    <div class="mx-auto grid max-w-3xl grid-cols-1 gap-4">
      <BlessingCard
        v-for="it in filtered"
        :key="it.id"
        :item="it"
        :full-text="true"
        class="w-full"
        style="height: auto"
      >
        <template #actions>
          <VBtn
            v-if="tab !== 'approve'"
            size="small"
            color="green"
            variant="flat"
            :loading="actId === it.id && act === 'approve'"
            @click="moderate(it.id, 'approve')"
          >
            {{ t("adminContribute.actions.approve") }}
          </VBtn>

          <VBtn
            v-if="tab !== 'reject'"
            size="small"
            color="red"
            variant="tonal"
            :loading="actId === it.id && act === 'reject'"
            @click="moderate(it.id, 'reject')"
          >
            {{ t("adminContribute.actions.reject") }}
          </VBtn>

          <VBtn
            v-if="tab === 'reject'"
            size="small"
            color="red-darken-2"
            variant="outlined"
            :loading="actId === it.id && act === 'delete'"
            @click="removePost(it.id)"
          >
            {{ t("adminContribute.actions.delete") }}
          </VBtn>
        </template>
      </BlessingCard>
    </div>

    <div class="flex items-center justify-center gap-2 pt-4">
      <VBtn :disabled="page <= 1" @click="page--">{{ t("pagination.prev") }}</VBtn>
      <span class="text-sm text-neutral-800">{{ t("pagination.page", { page }) }}</span>
      <VBtn :disabled="page >= maxPage" @click="page++">{{ t("pagination.next") }}</VBtn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RoleEnum } from "#shared/Enum";

definePageMeta({ middleware: ["auth", "admin"] });

const { t } = useI18n();
const { hasPerm } = useAuth();
useAuthRequiredSeo("adminContribute");

type Item = {
  id: number;
  isAnonymous: boolean;
  displayName: string;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string;
  author?: { id: number; name?: string | null; email: string };
};

const tab = ref<"pending" | "approve" | "reject">("pending");
const page = ref(1);
const pageSize = ref(18);
const kw = ref("");
const sortBy = ref<"createdAt" | "category" | "id">("createdAt");
const sortDir = ref<"desc" | "asc">("desc");

const sortByItems = computed(() => [
  { title: t("adminContribute.sort.createdAt"), value: "createdAt" },
  { title: t("adminContribute.sort.category"), value: "category" },
  { title: t("adminContribute.sort.id"), value: "id" },
]);

const sortDirItems = computed(() => [
  { title: t("adminContribute.sortDir.desc"), value: "desc" },
  { title: t("adminContribute.sortDir.asc"), value: "asc" },
]);

const { data, refresh } = await useFetch(() => `/api/admin/posts`, {
  query: computed(() => ({
    status: tab.value,
    page: page.value,
    pageSize: pageSize.value,
    sortBy: sortBy.value,
    sortDir: sortDir.value,
  })),
  watch: [tab, page, pageSize, sortBy, sortDir],
});

const items = computed<Item[]>(() => (data.value?.items || []) as Item[]);
const total = computed(() => data.value?.total || 0);
const maxPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

watch([tab, sortBy, sortDir], () => {
  page.value = 1;
});

const filtered = computed(() => {
  if (!kw.value) return items.value;

  const k = kw.value.toLowerCase();
  return items.value.filter(
    (i) =>
      i.message.toLowerCase().includes(k) ||
      i.displayName?.toLowerCase().includes(k) ||
      i.author?.name?.toLowerCase().includes(k) ||
      i.author?.email?.toLowerCase().includes(k),
  );
});

const actId = ref<number | null>(null);
const act = ref<"approve" | "reject" | "delete" | "none">("none");

async function moderate(id: number, action: "approve" | "reject") {
  actId.value = id;
  act.value = action;

  try {
    await $fetch("/api/admin/moderate", {
      method: "POST",
      body: { id, action },
    });

    toast.success(
      action === "approve"
        ? t("adminContribute.toast.approved")
        : t("adminContribute.toast.rejected"),
    );
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("adminContribute.toast.actionFailed"));
  } finally {
    actId.value = null;
    act.value = "none";
  }
}

async function removePost(id: number) {
  const ok = await toast.confirm(t("adminContribute.confirmDelete"));
  if (!ok) return;

  actId.value = id;
  act.value = "delete";

  try {
    await $fetch("/api/admin/posts/delete", {
      method: "POST",
      body: { id },
    });

    toast.success(t("adminContribute.toast.removed"));
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || t("adminContribute.toast.removeFailed"));
  } finally {
    actId.value = null;
    act.value = "none";
  }
}

function switchTab(nextTab: typeof tab.value) {
  tab.value = nextTab;
}
</script>

<style scoped lang="scss">
@reference "../../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
</style>
