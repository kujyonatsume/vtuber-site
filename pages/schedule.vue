<!-- pages/schedule.vue -->
<template>
  <section class="mx-auto max-w-7xl py-10">
    <h1 class="text-3xl font-bold mb-6">行程</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ScheduleCard v-for="s in schedule" :key="s.id" :item="s" />
    </div>
  </section>
</template>

<script setup lang="ts">
const schedule: SItem[] = [
  {
    id: "s1",
    title: "合作實況",
    date: "10/05",
    time: "20:00",
    platform: "YouTube",
    desc: "與 XX 聯動合作",
  },
  {
    id: "s2",
    title: "技術直播",
    date: "10/07",
    time: "21:00",
    platform: "Twitch",
    desc: "Nuxt + Three.js 小實作",
  },
  {
    id: "s3",
    title: "歌回",
    date: "10/10",
    time: "19:30",
    platform: "YouTube",
    desc: "點歌互動",
  },
];
</script>
