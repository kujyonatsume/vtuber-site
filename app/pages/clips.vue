<template>
  <section class="layout-container section-shell">
    <h1 class="mb-6 text-3xl font-bold">{{ t("clips.title") }}</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ClipCard
        v-for="i in 9"
        :key="i"
        :title="t('clips.cardTitle')"
        thumb="/hero.png"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}

.section-shell {
  @apply py-10 sm:py-12;
}
</style>
