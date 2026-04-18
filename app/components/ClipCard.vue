<template>
  <VCard
    class="group overflow-hidden transition-all duration-300 hover:shadow-lg border border-neutral-300/60"
    elevation="2"
    rounded="lg"
  >
    <div class="relative">
      <VImg
        :src="thumb"
        :alt="title"
        aspect-ratio="16/9"
        cover
        class="transition duration-300 group-hover:scale-105"
      >
        <template #placeholder>
          <VProgressCircular indeterminate color="secondary" />
        </template>
      </VImg>

      <!-- ✅ 固定右下角的時間標籤 -->
    </div>

    <VCardText class="bg-secondary-50">
      <h3
        class="font-semibold line-clamp-2 text-primary-900 group-hover:text-primary-700 transition"
      >
        {{ title }}
      </h3>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  thumb: string;
}>();
</script>
