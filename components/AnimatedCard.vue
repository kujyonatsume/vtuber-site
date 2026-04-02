<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "cute",
  },
});

const el = ref<HTMLElement>();
const show = ref(false);
const animating = ref(false);

let ticking = false;

function checkVisibility() {
  if (!el.value) return;

  const rect = el.value.getBoundingClientRect();
  const vh = window.innerHeight;

  const completelyOutside =
    rect.bottom <= 0 || rect.top >= vh;

  if (completelyOutside) {
    show.value = false;
    animating.value = false;
    return;
  }

  if (animating.value) return;

  show.value = true;
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
  if (!el.value) return;

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", checkVisibility);

  el.value.addEventListener("animationstart", () => {
    animating.value = true;
  });

  el.value.addEventListener("animationend", () => {
    animating.value = false;
  });

  checkVisibility(); // 初始化判斷
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", checkVisibility);
});

/* 切模式時重播 */
watch(
  () => props.mode,
  () => {
    if (show.value && !animating.value) {
      show.value = false;
      requestAnimationFrame(() => {
        show.value = true;
      });
    }
  }
);
</script>

<template>
  <div ref="el" class="card" :class="[show ? 'show' : '', mode]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.card {
  opacity: 0;
  transform: translateY(60px);
}

/* =========================
   可愛模式動畫
========================= */

.card.cute.show {
  animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.card.cute:not(.show) {
  animation: bounceOut 0.5s ease forwards;
}

/* =========================
   爆言模式動畫
========================= */

.card.battle.show {
  animation: battleIn 0.6s ease-out forwards;
}

.card.battle:not(.show) {
  animation: battleOut 0.4s ease-in forwards;
}

/* ===== 可愛進場 ===== */
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

/* ===== 可愛退場 ===== */
@keyframes bounceOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
}

/* ===== 爆言進場（硬派滑入）===== */
@keyframes battleIn {
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  60% {
    opacity: 1;
    transform: translateX(10px);
  }
  80% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ===== 爆言退場 ===== */
@keyframes battleOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(40px);
  }
}
</style>
