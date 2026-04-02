<script setup lang="ts">
import anime from "animejs";

const el = ref<HTMLElement | null>(null);

/* 使用 VueUse */
const mode = useLocalStorage<"cute" | "battle">("mode", "cute");

/* 切換 */
const toggleMode = () => {
  mode.value = mode.value === "cute" ? "battle" : "cute";
};

/* 爆言動畫 */
const applyBattleEffect = () => {
  if (!el.value) return;

  anime({
    targets: el.value,
    translateX: [-15, 15, -10, 10, -5, 5, 0],
    duration: 300,
    easing: "easeInOutSine",
  });

  anime({
    targets: el.value,
    boxShadow: [
      "0 0 0 rgba(0,0,0,0)",
      "0 0 80px rgba(185,28,28,0.9)",
      "0 0 0 rgba(0,0,0,0)",
    ],
    duration: 400,
  });
};

/* 只負責動畫，不負責儲存 */
watch(
  mode,
  (val) => {
    if (val === "battle") {
      applyBattleEffect();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    ref="el"
    :class="[
      'min-h-screen transition-all duration-700',
      mode === 'cute'
        ? 'bg-gradient-to-b from-green-100 via-white to-white text-black'
        : 'bg-gradient-to-b from-black via-red-950 to-red-900 text-red-100',
    ]"
  >
    <!-- 導航列 -->
    <nav class="flex items-center justify-between px-8 py-4">
      <div class="text-xl font-bold">雪KOYUKI</div>

      <div class="flex gap-6">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/activity">Activity</NuxtLink>
        <NuxtLink to="/album">Album</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </div>

      <button @click="toggleMode" class="px-4 py-2 border rounded">
        {{ mode === "cute" ? "可愛模式" : "爆言模式" }}
      </button>
    </nav>

    <NuxtPage />
    <!-- Footer -->
    <footer class="relative z-10 py-12 text-sm text-center opacity-60">
      Snowfall Annals © 2024. All rights reserved.
    </footer>
  </div>
</template>
