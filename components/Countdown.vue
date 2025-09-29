<template>
  <div class="text-center space-y-2 animate-slideUp">
    <h2 class="text-xl font-bold">{{ title }}</h2>
    <p class="text-3xl font-mono" aria-live="polite">
      {{ dd }} 天 {{ hh.toString().padStart(2, "0") }}:{{
        mm.toString().padStart(2, "0")
      }}:{{ ss.toString().padStart(2, "0") }}
    </p>
  </div>
</template>

<script setup lang="tsx">
const props = defineProps<{ target: string | number | Date; title?: string }>();
const title = computed(() => props.title ?? "活動倒數");
const now = ref(Date.now());
const tms = computed(() => new Date(props.target).getTime());
const diff = computed(() => Math.max(0, tms.value - now.value));
const dd = computed(() => Math.floor(diff.value / 86400000));
const hh = computed(() => Math.floor(diff.value / 3600000) % 24);
const mm = computed(() => Math.floor(diff.value / 60000) % 60);
const ss = computed(() => Math.floor(diff.value / 1000) % 60);
let timer: any;
onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
