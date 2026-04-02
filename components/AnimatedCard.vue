<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { KoyukiMode } from "~/composables/useKoyukiMode";

const props = withDefaults(
  defineProps<{
    mode?: KoyukiMode;
    threshold?: number;
    once?: boolean;
  }>(),
  {
    mode: "cute",
    threshold: 0.25,
    once: false,
  }
);

const el = ref<HTMLElement | null>(null);
const show = ref(false);
let observer: IntersectionObserver | null = null;

function restartAnimation() {
  if (!show.value) return;
  show.value = false;
  requestAnimationFrame(() => {
    show.value = true;
  });
}

watch(
  () => props.mode,
  () => {
    restartAnimation();
  }
);

onMounted(() => {
  if (!el.value) return;

  if (!("IntersectionObserver" in window)) {
    show.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        show.value = true;
        if (props.once) observer?.disconnect();
        return;
      }

      if (!props.once) show.value = false;
    },
    {
      threshold: props.threshold,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  observer.observe(el.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="el" class="animated-card" :class="[mode, show ? 'is-visible' : '']">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.animated-card {
  opacity: 0;
  transition: opacity 0.26s ease, transform 0.26s ease;
  will-change: transform, opacity;
}

.animated-card.cute {
  transform: translateY(54px) scale(0.94);
}

.animated-card.battle {
  transform: translateX(-40px);
}

.animated-card.cute.is-visible {
  animation: cuteIn 0.78s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.animated-card.battle.is-visible {
  animation: battleIn 0.58s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cuteIn {
  0% {
    opacity: 0;
    transform: translateY(54px) scale(0.94);
  }
  55% {
    opacity: 1;
    transform: translateY(-10px) scale(1.03);
  }
  80% {
    transform: translateY(4px) scale(0.99);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes battleIn {
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  60% {
    opacity: 1;
    transform: translateX(8px);
  }
  82% {
    transform: translateX(-4px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
