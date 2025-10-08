<template>
  <section class="mx-auto max-w-7xl py-10 space-y-10">
    <header class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-6">
        <h1 class="text-3xl sm:text-5xl font-extrabold">周年／生日應援企劃</h1>
        <p class="text-neutral-800">
          投稿祝福、上傳作品，一起在當天用彈幕與投票為她應援。
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
      <div class="relative">
        <img
          src="/hero.png"
          alt="event"
          class="w-full rounded-3xl drop-shadow-2xl animate-float"
        />
      </div>
    </header>

    <Countdown :target="target" title="距離活動開始" />

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <h3 class="font-semibold mb-2">投稿</h3>
        <p class="text-neutral-800">插畫、訊息、或影片連結，皆可。</p>
      </div>
      <div class="card p-6">
        <h3 class="font-semibold mb-2">展示</h3>
        <p class="text-neutral-800">審核通過後出現在祝福牆。</p>
      </div>
      <div class="card p-6">
        <h3 class="font-semibold mb-2">互動</h3>
        <p class="text-neutral-800">直播當天參與投票與抽選。</p>
      </div>
    </section>
  </section>
</template>

<script setup lang="tsx">
const target = "2025-12-27T00:00:00+08:00";
</script>
