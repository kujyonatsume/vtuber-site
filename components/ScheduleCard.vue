<!-- components\ScheduleCard.vue -->
<template>
  <div class="card p-5 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-lg">{{ item.title }}</h3>
      <span class="text-xs text-neutral-400">{{ item.platform }}</span>
    </div>
    <p class="text-sm text-neutral-300">{{ item.desc }}</p>
    <div class="flex items-center justify-between text-sm text-neutral-400">
      <span>{{ item.date }} {{ item.time }}</span>
      <NuxtLink :to="'/schedule#' + item.id" class="hover:text-primary"
        >細節</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ item: SItem }>();
</script>
