<template>
  <section class="layout-container section-shell">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">祝福牆</h1>
      <NuxtLink
        to="/event/submit"
        class="btn-accent"
        >我要投稿</NuxtLink
      >
    </div>
    <div class="space-y-5">
      <article v-for="it in list" :key="it.id" class="card overflow-hidden">
        <div class="grid gap-0 md:grid-cols-[280px_1fr]">
          <div
            class="relative min-h-[200px] bg-neutral-100"
            :class="isLikelyImage(it.assetUrl) ? '' : 'grid place-items-center'"
          >
            <img
              v-if="isLikelyImage(it.assetUrl)"
              :src="it.assetUrl || ''"
              class="h-full w-full object-cover"
            />
            <div v-else class="px-6 text-center text-neutral-700">
              <div class="mb-2 text-xs tracking-widest">BLESSING</div>
              <div class="text-base font-semibold">{{ it.category }}</div>
            </div>
          </div>

          <div class="flex flex-col gap-4 p-6">
            <header class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div class="text-sm font-semibold text-primary-900">
                  {{ it.nickname || "匿名" }}
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

            <footer class="mt-auto flex items-center justify-between text-xs text-neutral-800">
              <span>來自 {{ it.nickname || "匿名" }} 的投稿</span>
              <a
                v-if="it.assetUrl && !isLikelyImage(it.assetUrl)"
                :href="it.assetUrl"
                target="_blank"
                class="hover:underline"
              >
                查看附件
              </a>
            </footer>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
type BoardItem = {
  id: number | string;
  nickname?: string;
  category: string;
  message: string;
  assetUrl?: string | null;
  createdAt: string;
};

const { data: list } = await useFetch<BoardItem[]>("/api/public/list");

function cleanText(input: string) {
  return (input || "").replace(/\s+/g, " ").trim();
}

function postTitle(message: string) {
  const text = cleanText(message);
  if (!text) return "未命名祝福";
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
