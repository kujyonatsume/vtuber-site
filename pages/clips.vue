<!-- pages/clips.vue -->
<template>
  <section class="mx-auto max-w-7xl py-10">
    <h1 class="text-3xl font-bold mb-6">剪輯</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ClipCard
        v-for="i in 9"
        :title="'精彩片段 ' + i"
        thumb="/event/hero.png"
        duration="08:30"
        views="1.2K"
        uploadedAt="昨天"
      />
    </div>
  </section>
</template>
