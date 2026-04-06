<template>
  <section class="space-y-10 layout-container section-shell">
    <header
      class="relative p-6 overflow-hidden border rounded-3xl border-neutral-300/70 bg-white/90 sm:p-10"
      style="box-shadow: var(--app-shadow-strong)"
    >
      <div
        aria-hidden
        class="absolute w-56 h-56 rounded-full pointer-events-none -left-16 -top-16 bg-primary-300/35 blur-3xl"
      />
      <div
        aria-hidden
        class="absolute w-64 h-64 rounded-full pointer-events-none -bottom-16 -right-16 bg-secondary-300/35 blur-3xl"
      />

      <div class="relative grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="space-y-6 reveal-up">
          <p
            class="inline-flex rounded-full border border-primary-200/80 bg-primary-50 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-primary-700"
          >
            OFFICIAL FAN SUPPORT
          </p>
          <h1 class="text-3xl font-black tracking-tight text-primary-900 sm:text-5xl">
            周年／生日粉絲應援企劃
          </h1>
          <p class="text-base leading-relaxed text-neutral-800">
            投稿祝福、上傳作品，活動當天參與投票與抽選，一起把應援氛圍推到最滿。
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/wishes/new" class="btn-accent">我要投稿</NuxtLink>
            <NuxtLink to="/wishes" class="btn-secondary">祝福牆</NuxtLink>
            <NuxtLink
              to="/event"
              class="inline-flex items-center gap-2 rounded-2xl border border-secondary-300 bg-white px-5 py-3 text-secondary-700 transition hover:bg-secondary-50"
            >
              查看活動詳情
            </NuxtLink>
          </div>
          <div class="max-w-sm">
            <Countdown title="距離活動開始" />
          </div>
        </div>

        <div class="reveal-up reveal-delay-1">
          <img
            src="/hero.png"
            alt="周年活動主視覺"
            class="w-full rounded-3xl border border-white/70 bg-white/80 object-cover shadow-[0_24px_48px_-20px_rgba(15,23,42,0.45)]"
          />
        </div>
      </div>
    </header>

    <div id="clips">
      <h2 class="mb-4 text-2xl font-bold">熱門剪輯</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ClipCard v-for="c in clips" :title="c.title" :thumb="c.thumb" />
      </div>
    </div>
  </section>
</template>

<script setup lang="tsx">
const clips = [
  {
    title: "高能剪輯",
    thumb: "/hero.png",
  },
  {
    title: "失誤瞬間合集",
    thumb: "/hero.png",
  },
  {
    title: "觀眾互動精華",
    thumb: "/hero.png",
  },
];
</script>
