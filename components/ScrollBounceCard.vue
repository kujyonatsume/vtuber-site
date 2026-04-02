<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const el = ref<HTMLElement>();
const show = ref(false);

let ticking = false;

function checkVisibility() {
  if (!el.value) return;

  const rect = el.value.getBoundingClientRect();
  const vh = window.innerHeight;

  const elementHeight = rect.height;

  // 計算進入 viewport 的高度
  const visibleHeight =
    Math.min(rect.bottom, vh) - Math.max(rect.top, 0);

  const visibleRatio = visibleHeight / elementHeight;

  show.value = visibleRatio > 0.2;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      checkVisibility();
      ticking = false;
    });
    ticking = true;
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", checkVisibility);

  checkVisibility(); // 初始化
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", checkVisibility);
});
</script>

<template>
  <div ref="el" class="card" :class="{ show }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  opacity: 0;
  transform: translateY(60px) scale(0.9);

  &.show {
    animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  &:not(.show) {
    animation: bounceOut 0.5s ease forwards;
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(-15px) scale(1.05);
  }
  80% {
    transform: translateY(5px) scale(0.98);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes bounceOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-6px) scale(1.02);
  }
  100% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
}

</style>
