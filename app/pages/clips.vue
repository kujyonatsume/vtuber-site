<template>
  <section class="layout-container section-shell">
    <h1 class="text-3xl font-bold mb-6">剪輯</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ClipCard
        v-for="i in 9"
        title="精彩片段"
        thumb="/hero.png"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@reference "../assets/styles/tailwind.css";

.layout-container {
  @apply mx-auto w-full max-w-7xl px-4 lg:px-8 sm:px-6;
}

.section-shell {
  @apply py-10 sm:py-12;
}
</style>
