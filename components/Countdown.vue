<template>
  <div class="reveal-up text-center">
    <h2 class="text-xl font-bold">{{ title }}</h2>

    <p v-if="expired" class="mt-2 text-lg font-semibold text-primary-700">
      活動已開始
    </p>

    <p v-else class="mt-2 text-3xl font-mono" aria-live="polite">
      {{ dd }} 天 {{ hh.toString().padStart(2, "0") }}:{{
        mm.toString().padStart(2, "0")
      }}:{{ ss.toString().padStart(2, "0") }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    target?: string | number | Date;
  }>(),
  {
    title: "活動倒數",
    target: "2026-12-27T00:00:00+08:00",
  }
);

const diff = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const end = computed(() => new Date(props.target).getTime());
const expired = computed(() => diff.value <= 0);

function updateDiff() {
  const endAt = end.value;
  if (Number.isNaN(endAt)) {
    diff.value = 0;
    return;
  }
  diff.value = Math.max(0, endAt - Date.now());
}

onMounted(() => {
  updateDiff();
  timer = setInterval(updateDiff, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

watch(() => props.target, updateDiff);

const dd = computed(() => Math.floor(diff.value / 86400000));
const hh = computed(() => Math.floor(diff.value / 3600000) % 24);
const mm = computed(() => Math.floor(diff.value / 60000) % 60);
const ss = computed(() => Math.floor(diff.value / 1000) % 60);
</script>

<style scoped lang="scss">
.reveal-up {
  animation: revealUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes revealUp {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
