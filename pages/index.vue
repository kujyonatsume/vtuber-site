<template>
  <section class="layout-container section-shell space-y-10">
    <!-- 首頁輪播 -->
    <div class="py-2">
      <HomeCarousel />
    </div>

    <!-- 活動 CTA -->
    <div>
      <div class="card card-hover grid grid-cols-1 items-center gap-6 p-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <h2 class="mb-2 text-2xl font-bold">周年／生日粉絲應援企劃</h2>
          <p class="mb-4 text-neutral-800">
            投稿祝福、上傳作品，活動當天參與投票與抽選。
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/event/submit" class="btn-accent">我要投稿</NuxtLink>
            <NuxtLink to="/event/board" class="btn-secondary">祝福牆</NuxtLink>
            <NuxtLink
              to="/koyuki"
              class="inline-flex items-center gap-2 rounded-2xl border border-primary-300 bg-white px-5 py-3 text-primary-700 transition hover:bg-primary-50"
            >
              雪KOYUKI 專頁
            </NuxtLink>
          </div>
        </div>
        <div>
          <Countdown title="距離活動開始" />
        </div>
      </div>
    </div>

    <div id="clips">
      <h2 class="mb-4 text-2xl font-bold">熱門剪輯</h2>
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
