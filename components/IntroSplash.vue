<template>
  <Transition appear name="splash">
    <div
      v-if="show"
      class="fixed inset-0 z-[9999] grid place-items-center bg-gray-950"
      aria-label="opening animation"
    >
      <div class="flex flex-col items-center gap-4">
        <img src="/hero.png" alt="logo" />
        <p class="text-xl font-bold tracking-wide">VTuber Project</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="tsx">
const show = ref(true);
const HOLD = 900; // 顯示停留毫秒
const FADE = 450; // 淡入/淡出毫秒（需與 CSS 一致）

onMounted(() => {
  setTimeout(() => (show.value = false), HOLD + FADE); // 先淡入(HOLD)再淡出
});
</script>

<style scoped>
/* 外層遮罩淡入淡出 */
.splash-enter-active,
.splash-leave-active {
  transition: opacity 0.45s ease;
}
.splash-enter-from,
.splash-leave-to {
  opacity: 0;
}

/* 內容同步淡入淡出（稍微延遲，增加層次） */
.splash-enter-active > div,
.splash-leave-active > div {
  transition: opacity 0.45s ease 0.05s, transform 0.45s ease 0.05s;
}
.splash-enter-from > div,
.splash-leave-to > div {
  opacity: 0;
  transform: translateY(6px);
}

/* 無動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  .splash-enter-active,
  .splash-leave-active,
  .splash-enter-active > div,
  .splash-leave-active > div {
    transition: none !important;
  }
}
</style>
