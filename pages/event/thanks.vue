<template>
  <section class="section-shell mx-auto max-w-4xl space-y-6">
    <h1 class="text-3xl font-bold">感謝名單</h1>
    <p class="text-neutral-800">感謝所有協力者與贊助者（依時間序）。</p>
    <div class="card card-hover p-6">
      <ul class="space-y-2">
        <li
          v-for="s in sponsors"
          :key="s.id"
          class="flex items-center justify-between"
        >
          <span>{{ s.name }}</span>
          <span class="text-sm text-neutral-800">{{ s.tier }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="tsx">
const { data: sponsors } = await useFetch<
  { id: string; name: string; tier: string }[]
>("/api/public/sponsors");
</script>
