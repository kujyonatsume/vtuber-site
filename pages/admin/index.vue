<template>
  <section class="py-8 space-y-6 layout-container">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">投稿審核</h1>
      <div class="flex items-center gap-3">
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

    <div class="space-y-6">
      <article
        v-for="it in filtered"
        :key="it.id"
        class="overflow-hidden card"
      >
        <div class="grid gap-0 md:grid-cols-[320px_1fr]">
          <div
            class="relative min-h-[220px] bg-neutral-100"
            :class="isLikelyImage(it.assetUrl) ? '' : 'grid place-items-center'"
          >
            <img
              v-if="isLikelyImage(it.assetUrl)"
              :src="it.assetUrl || ''"
              class="h-full w-full object-cover"
            />
            <div v-else class="px-6 text-center text-neutral-700">
              <div class="mb-2 text-xs tracking-widest">POST</div>
              <div class="text-base font-semibold">{{ it.category }}</div>
            </div>
          </div>

          <div class="flex flex-col gap-4 p-6">
            <header class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div class="text-sm text-neutral-700">
                  {{ it.author?.name || it.author?.email || "匿名" }}
                </div>
                <div class="text-xs text-neutral-800">
                  {{ new Date(it.createdAt).toLocaleString() }}
                </div>
              </div>
              <VChip size="x-small" color="primary">{{ it.category }}</VChip>
            </header>

            <div class="space-y-2">
              <h2 class="text-xl font-bold leading-snug text-primary-900">
                {{ postTitle(it.message) }}
              </h2>
              <p class="text-sm leading-relaxed text-neutral-800">
                {{ postExcerpt(it.message) }}
              </p>
            </div>

            <footer class="mt-auto flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3 text-xs text-neutral-800">
                <span>❤️ {{ it.likes ?? 0 }}</span>
                <a
                  v-if="it.assetUrl && !isLikelyImage(it.assetUrl)"
                  :href="it.assetUrl"
                  target="_blank"
                  class="hover:underline"
                >
                  查看附件
                </a>
              </div>

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
                <VBtn
                  v-if="tab === 'reject'"
                  size="small"
                  color="red-darken-2"
                  variant="outlined"
                  :loading="actId === it.id && act === 'delete'"
                  @click="removePost(it.id)"
                  >刪除</VBtn
                >
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>

    <div class="flex items-center justify-center gap-2 pt-4">
      <VBtn :disabled="page <= 1" @click="page--">上一頁</VBtn>
      <span class="text-sm text-neutral-800">第 {{ page }} 頁</span>
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

const { data, pending, refresh } = await useFetch(() => `/api/admin/posts`, {
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

function cleanText(input: string) {
  return (input || "").replace(/\s+/g, " ").trim();
}

function postTitle(message: string) {
  const text = cleanText(message);
  if (!text) return "未命名投稿";
  return text.length > 32 ? `${text.slice(0, 32)}...` : text;
}

function postExcerpt(message: string) {
  const text = cleanText(message);
  if (!text) return "（無內文）";
  return text.length > 140 ? `${text.slice(0, 140)}...` : text;
}

function isLikelyImage(url?: string | null) {
  if (!url) return false;
  if (url.startsWith("/static/")) return true;
  const clean = url.split("?")[0].toLowerCase();
  return /\.(png|jpe?g|gif|webp|avif|svg)$/.test(clean);
}
</script>
