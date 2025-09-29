<template>
  <section class="mx-auto max-w-7xl py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">祝福牆</h1>
      <NuxtLink to="/event/submit" class="btn-primary">我要投稿</NuxtLink>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <article v-for="it in list" :key="it.id" class="card p-4 group">
        <header class="flex items-center justify-between mb-2">
          <strong>{{ it.nickname }}</strong>
          <VChip size="x-small" color="primary">{{ it.category }}</VChip>
        </header>
        <p class="text-sm text-neutral-300 mb-2">{{ it.message }}</p>
        <img
          v-if="it.assetUrl"
          :src="it.assetUrl"
          class="rounded-lg object-cover max-h-56 w-full"
        />
        <footer
          class="mt-3 flex items-center justify-between text-xs text-neutral-400"
        >
          <span>{{ new Date(it.createdAt).toLocaleString() }}</span>

        </footer>
      </article>
    </div>
  </section>
</template>

<script setup lang="tsx">
const { data: list } = await useFetch("/api/public/list");

</script>
