<template>
  <main class="min-h-screen px-4 py-16">
    <section class="max-w-5xl mx-auto">
      <header class="mb-12 text-center">
        <p class="mb-3 text-sm tracking-[0.2em] text-slate-500">SHOWCASE</p>
        <h1 class="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
          Scroll Bounce Card
        </h1>
        <p class="max-w-2xl mx-auto text-slate-600">
          向下滾動頁面，卡片進入視窗時會自動觸發彈跳進場動畫。
        </p>
      </header>

      <div class="pb-24 space-y-8">
        <ScrollBounceCard
          v-for="item in cards"
          :key="item.id"
          class="p-6 bg-white border shadow-sm rounded-2xl border-slate-200 md:p-8 min-h-[280px]"
        >
          <div
            class="inline-flex px-3 py-1 mb-3 text-xs font-semibold text-white rounded-full bg-slate-900"
          >
            {{ item.tag }}
          </div>
          <h2 class="mb-2 text-2xl font-semibold text-slate-900">
            {{ item.title }}
          </h2>
          <p class="text-slate-600">
            {{ item.description }}
          </p>
        </ScrollBounceCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const cards = [
  {
    id: 1,
    tag: "Chapter 01",
    title: "Snowfront Observatory",
    description: "追蹤高山雪線變化與當日降雪資料，建立每週視覺化觀測紀錄。",
  },
  {
    id: 2,
    tag: "Chapter 02",
    title: "Frost Signal",
    description: "彙整北半球主要滑雪區的溫度與積雪深度，協助判斷最佳上山時機。",
  },
  {
    id: 3,
    tag: "Chapter 03",
    title: "Winter Archive",
    description: "把歷史寒流事件與最新天氣預報合併，快速比對極端氣候週期。",
  },
  {
    id: 4,
    tag: "Chapter 04",
    title: "Polar Route",
    description: "提供可滾動的卡片資訊流，讓重點資料在閱讀時自然分段呈現。",
  },
];
</script>

<style lang="scss" scoped></style>
