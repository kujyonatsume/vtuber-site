<script setup lang="ts">
const mode = useLocalStorage("mode", "cute");
</script>

<template>
  <div class="py-24">
    <AnimatedCard
      :mode="mode"
      class="max-w-4xl px-6 mx-auto text-center"
    >
      <h1 class="text-4xl font-bold">About Snowfall Annals</h1>

      <p class="mt-8 leading-relaxed">
        Snowfall Annals 是一個粉絲向紀念企劃網站，
        以「子午計畫 雪KOYUKI」為核心，
        記錄她的世界觀、角色設定與舞台魅力。
      </p>

      <div
        class="p-8 mt-16 transition rounded-xl"
        :class="
          mode === 'cute'
            ? 'bg-green-50/60'
            : 'bg-black/60 border border-red-900'
        "
      >
        <h2 class="text-2xl font-semibold">企劃理念</h2>
        <p class="mt-4 leading-relaxed">
          可愛與競技並存。
          柔軟與鋒利共鳴。
          讓角色設定不只是文字，
          而是一個可以被體驗的世界。
        </p>
      </div>
    </AnimatedCard>
  </div>
</template>
