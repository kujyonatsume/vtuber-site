<script setup lang="ts">
const { mode, isCute } = useKoyukiMode();

const cards = [
  {
    id: 1,
    tag: "Visual 01",
    title: "Snow Stage Debut",
    description: "雪KOYUKI 首次競技舞台登場紀錄，從可愛到爆言的轉換瞬間。",
  },
  {
    id: 2,
    tag: "Visual 02",
    title: "Frost Aim",
    description: "爆言模式啟動，專注鎖定目標的戰鬥畫面。",
  },
  {
    id: 3,
    tag: "Visual 03",
    title: "Lucky Clover",
    description: "可愛模式日常視覺，四葉幸運草元素象徵祝福。",
  },
  {
    id: 4,
    tag: "Visual 04",
    title: "Snowfall Archive",
    description: "子午計畫世界觀延伸插圖與舞台光影設計。",
  },
];
</script>

<template>
  <main class="min-h-screen px-4 py-16">

    <section class="max-w-5xl mx-auto">

      <!-- Header -->
      <header class="mb-16 text-center">
        <p
          class="mb-3 text-sm tracking-[0.2em]"
          :class="isCute ? 'text-emerald-500' : 'text-red-400'"
        >
          GALLERY
        </p>

        <h1
          class="mb-4 text-4xl font-bold md:text-5xl"
          :class="isCute ? 'text-slate-900' : 'text-red-100'"
        >
          雪KOYUKI Visual Archive
        </h1>

        <p
          class="max-w-2xl mx-auto"
          :class="isCute ? 'text-slate-600' : 'text-red-200/70'"
        >
          向下滾動頁面，卡片進入視窗時會自動觸發彈跳進場動畫。
        </p>
      </header>

      <!-- Scroll 卡片列表 -->
      <div class="pb-24 space-y-10">
        <ScrollBounceCard
          v-for="item in cards"
          :key="item.id"
          :mode="mode"
          class="p-8 transition border shadow-sm rounded-2xl min-h-[280px]"
          :class="
            isCute
              ? 'bg-white border-slate-200'
              : 'bg-black/60 border-red-900 text-red-100'
          "
        >
          <!-- Tag -->
          <div
            class="inline-flex px-3 py-1 mb-4 text-xs font-semibold text-white rounded-full"
            :class="isCute ? 'bg-slate-900' : 'bg-red-900'"
          >
            {{ item.tag }}
          </div>

          <!-- Title -->
          <h2 class="mb-3 text-2xl font-semibold">
            {{ item.title }}
          </h2>

          <!-- Description -->
          <p
            :class="isCute
              ? 'text-slate-600'
              : 'text-red-200/70'"
          >
            {{ item.description }}
          </p>

          <!-- 假圖預留區 -->
          <div
            class="mt-8 rounded-xl aspect-[16/9]"
            :class="
              isCute
                ? 'bg-gradient-to-br from-green-100 to-white'
                : 'bg-gradient-to-br from-black to-red-900'
            "
          />
        </ScrollBounceCard>
      </div>

    </section>
  </main>
</template>

<style scoped></style>
