<template>
  <section class="relative overflow-hidden py-16 sm:py-24">
    <div aria-hidden class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl"
      />
    </div>

    <div
      class="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
    >
      <div class="space-y-6 reveal-up">
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Hello, 我是 <span class="text-brand">夏目</span> 👋
        </h1>
        <p class="text-neutral-900 leading-relaxed">
          專注遊戲實況、技術分享與互動活動。追蹤行程、觀看精華剪輯，或與我合作。
        </p>
        <div class="flex flex-wrap gap-3">
          <a
            href="#clips"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 hover:border-white/20 transition"
            >熱門剪輯</a
          >
        </div>
        <div class="flex items-center gap-3">
          <LiveBadge :live="isLive" />
          <span class="text-sm text-gray-400">Twitch / YouTube 同步</span>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -bottom-6 -right-6 hidden sm:block">
          <div class="card p-4 animate-glow">
            <p class="text-sm">下一場：<strong>週六 20:00</strong>｜合作企劃</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="tsx">
const isLive = false; // 可改為 API 狀態
</script>
