<template>
  <section class="py-8 space-y-6 layout-container">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">投稿審核</h1>
      <div v-if="hasPerm(RoleEnum.Admin)" class="flex items-center gap-3">
        <VBtn to="/admin/users" variant="tonal" rounded="lg">使用者管理</VBtn>
        <div class="text-sm text-neutral-800">共 {{ total }} 筆</div>
      </div>
    </header>

    <div class="flex flex-wrap gap-2">
      <VBtn
        :color="tab === 'pending' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('pending')"
        >待審</VBtn
      >
      <VBtn
        :color="tab === 'approve' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('approve')"
        >通過</VBtn
      >
      <VBtn
        :color="tab === 'reject' ? 'primary' : ''"
        variant="tonal"
        rounded="lg"
        @click="switchTab('reject')"
        >退回</VBtn
      >
      <div class="flex-1" />
      <VTextField
        v-model="kw"
        density="comfortable"
        hide-details
        placeholder="關鍵字過濾（前端）"
        style="max-width: 240px"
      />
      <VSelect
        v-model="sortBy"
        :items="sortByItems"
        density="comfortable"
        hide-details
        label="排序欄位"
        style="max-width: 160px"
      />
      <VSelect
        v-model="sortDir"
        :items="sortDirItems"
        density="comfortable"
        hide-details
        label="排序方向"
        style="max-width: 140px"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <BlessingCard
        v-for="it in filtered"
        :key="it.id"
        :item="it"
        :full-text="true"
      >
        <template #actions>
          <VBtn
            v-if="tab !== 'approve'"
            size="small"
            color="green"
            variant="flat"
            :loading="actId === it.id && act === 'approve'"
            @click="moderate(it.id, 'approve')"
            >通過</VBtn
          >
          <VBtn
            v-if="tab !== 'reject'"
            size="small"
            color="red"
            variant="tonal"
            :loading="actId === it.id && act === 'reject'"
            @click="moderate(it.id, 'reject')"
            >退回</VBtn
          >
          <VBtn
            v-if="tab === 'reject'"
            size="small"
            color="red-darken-2"
            variant="outlined"
            :loading="actId === it.id && act === 'delete'"
            @click="removePost(it.id)"
            >刪除</VBtn
          >
        </template>
      </BlessingCard>
    </div>

    <div class="flex items-center justify-center gap-2 pt-4">
      <VBtn :disabled="page <= 1" @click="page--">上一頁</VBtn>
      <span class="text-sm text-neutral-800">第 {{ page }} 頁</span>
      <VBtn :disabled="page >= maxPage" @click="page++">下一頁</VBtn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RoleEnum } from '~/shared/Enum';

definePageMeta({ middleware: ["auth", "admin"] });
const { hasPerm } = useAuth();

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

const sortByItems = [
  { title: "建立時間", value: "createdAt" },
  { title: "類別", value: "category" },
  { title: "編號", value: "id" },
];
const sortDirItems = [
  { title: "遞減", value: "desc" },
  { title: "遞增", value: "asc" },
];

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
const items = computed<Item[]>(() => (data.value?.items || []) as any);
const total = computed(() => data.value?.total || 0);
const maxPage = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
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
      i.author?.email?.toLowerCase().includes(k)
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
    toast.success(action === "approve" ? "已通過" : "已退回");
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || "操作失敗");
  } finally {
    actId.value = null;
    act.value = "none";
  }
}

async function removePost(id: number) {
  if (import.meta.client && !window.confirm("確定要刪除這筆投稿嗎？此操作無法復原。")) {
    return;
  }

  actId.value = id;
  act.value = "delete";
  try {
    await $fetch("/api/admin/posts/delete", {
      method: "POST",
      body: { id },
    });
    toast.success("已刪除");
    await refresh();
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || e?.message || "刪除失敗");
  } finally {
    actId.value = null;
    act.value = "none";
  }
}

function switchTab(t: typeof tab.value) {
  tab.value = t;
}

</script>
