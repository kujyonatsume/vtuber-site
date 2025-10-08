<template>
  <section>
    <!-- 首頁輪播 -->
    <div class="mx-auto max-w-7xl px-0 py-6">
      <HomeCarousel />
    </div>

    <!-- 活動 CTA -->
    <div class="mx-auto max-w-7xl py-8 sm:py-12">
      <div
        class="card p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center border border-neutral-300/60 bg-neutral-50"
      >
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold mb-2">周年／生日粉絲應援企劃</h2>
          <p class="text-neutral-800 mb-4">
            投稿祝福、上傳作品，活動當天參與投票與抽選。
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/event/submit"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700"
              >我要投稿</NuxtLink
            >
            <NuxtLink
              to="/event/board"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-600 text-white hover:bg-secondary-700"
              >祝福牆</NuxtLink
            >
          </div>
        </div>
        <div>
          <Countdown title="距離活動開始" />
        </div>
      </div>
    </div>

    <div id="clips" class="mx-auto max-w-7xl py-8 sm:py-12">
      <h2 class="text-2xl font-bold mb-4">熱門剪輯</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
