<template>
  <section>
    <!-- 首頁輪播 -->
    <div class="mx-auto max-w-7xl px-0 py-6">
      <HomeCarousel />
    </div>

    <!-- 活動 CTA -->
    <div class="mx-auto max-w-7xl py-8 sm:py-12">
      <div class="card p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold mb-2">周年／生日粉絲應援企劃</h2>
          <p class="text-neutral-300 mb-4">
            投稿祝福、上傳作品，活動當天參與投票與抽選。
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/event/submit"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-100/10 hover:border-neutral-100/20"
              >我要投稿</NuxtLink
            >
            <NuxtLink
              to="/event/board"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-100/10 hover:border-neutral-100/20"
              >祝福牆</NuxtLink
            >
          </div>
        </div>
        <div>
          <Countdown :target="target" title="距離活動開始" />
        </div>
      </div>
    </div>

    <div id="clips" class="mx-auto max-w-7xl py-8 sm:py-12">
      <h2 class="text-2xl font-bold mb-4">熱門剪輯</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClipCard v-for="c in clips" :key="c.title" v-bind="c" />
      </div>
    </div>
  </section>
</template>

<script setup lang="tsx">
const target = "2025-12-01T20:00:00+08:00"; // TODO: 改為實際日期

const clips = [
  {
    title: "高能剪輯 #1",
    thumb: "/clips/1.jpg",
    duration: "10:21",
    views: "12K",
    uploadedAt: "2 天前",
  },
  {
    title: "失誤瞬間合集",
    thumb: "/clips/2.jpg",
    duration: "07:05",
    views: "8.2K",
    uploadedAt: "5 天前",
  },
  {
    title: "觀眾互動精華",
    thumb: "/clips/3.jpg",
    duration: "12:10",
    views: "15K",
    uploadedAt: "1 週前",
  },
];
</script>
