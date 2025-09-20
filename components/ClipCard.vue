<!-- components\ClipCard.vue -->
<template>
  <article class="card overflow-hidden group">
    <div class="aspect-video relative">
      <img
        :src="thumb"
        :alt="title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <span
        class="absolute bottom-2 right-2 rounded bg-neutral-900/60 text-neutral-50 text-xs px-2 py-0.5"
        >{{ duration }}</span
      >
    </div>
    <div class="p-4">
      <h3
        class="font-semibold line-clamp-2 group-hover:text-primary transition"
      >
        {{ title }}
      </h3>
      <p class="text-sm text-neutral-400 mt-1">
        {{ views }} 觀看・{{ uploadedAt }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  thumb: string;
  duration: string;
  views: string;
  uploadedAt: string;
}>();
</script>
