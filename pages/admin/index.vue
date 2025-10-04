<template>
  <section class="mx-auto max-w-7xl py-8 space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">投稿審核</h1>
      <div class="text-sm text-neutral-600">共 {{ total }} 筆</div>
    </header>

    <div class="flex gap-2">
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
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <article v-for="it in filtered" :key="it.id" class="card p-4 space-y-3">
        <header class="flex items-start justify-between gap-2">
          <div>
            <div class="font-semibold">
              {{ it.author?.name || it.author?.email || "匿名" }}
            </div>
            <div class="text-xs text-neutral-600">
              {{ new Date(it.createdAt).toLocaleString() }}
            </div>
          </div>
          <VChip size="x-small" color="primary">{{ it.category }}</VChip>
        </header>

        <p class="text-sm text-neutral-800 whitespace-pre-line">
          {{ it.message }}
        </p>
        <img
          v-if="it.assetUrl"
          :src="it.assetUrl"
          class="rounded-lg object-cover max-h-56 w-full"
        />

        <footer class="flex items-center justify-between">
          <div class="text-xs text-neutral-600">❤️ {{ it.likes }}</div>
          <div class="flex gap-2">
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
          </div>
        </footer>
      </article>
    </div>

    <div class="flex items-center justify-center gap-2 pt-4">
      <VBtn :disabled="page <= 1" @click="page--">上一頁</VBtn>
      <span class="text-sm text-neutral-600">第 {{ page }} 頁</span>
      <VBtn :disabled="page >= maxPage" @click="page++">下一頁</VBtn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toast } from "vuetify-sonner";
definePageMeta({ middleware: ["auth", "admin"] });

type Item = {
  id: number;
  category: string;
  message: string;
  assetUrl?: string | null;
  likes: number;
  createdAt: string;
  author?: { id: number; name?: string | null; email: string };
};
const tab = ref<"pending" | "approve" | "reject">("pending");
const page = ref(1);
const pageSize = ref(18);
const kw = ref("");

const { data, pending, refresh } = await useFetch(() => `/api/admin/posts`, {
  query: { status: tab.value, page: page.value, pageSize: pageSize.value },
  watch: [tab, page, pageSize],
});
const items = computed<Item[]>(() => (data.value?.items || []) as any);
const total = computed(() => data.value?.total || 0);
const maxPage = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
watch([tab], () => {
  page.value = 1;
});

const filtered = computed(() => {
  if (!kw.value) return items.value;
  const k = kw.value.toLowerCase();
  return items.value.filter(
    (i) =>
      i.message.toLowerCase().includes(k) ||
      i.author?.name?.toLowerCase().includes(k) ||
      i.author?.email?.toLowerCase().includes(k)
  );
});

const actId = ref<number | null>(null);
const act = ref<"approve" | "reject" | "none">("none");
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

function switchTab(t: typeof tab.value) {
  tab.value = t;
}
</script>
